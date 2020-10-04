from pydantic import BaseModel
from typing import Optional
from meross_iot.manager import MerossManager, BaseDevice
from meross_iot.http_api import MerossHttpClient
from fastapi import FastAPI, HTTPException, Path
import asyncio
import os

from dotenv import load_dotenv
load_dotenv(verbose=True)


app = FastAPI()

ready = False

manager: MerossManager
http_api_client: MerossHttpClient
devices = {}

EMAIL = os.environ.get('MEROSS_EMAIL') or ""
PASSWORD = os.environ.get('MEROSS_PASSWORD') or ""


@app.on_event("startup")
async def startup_event():
    global http_api_client
    http_api_client = await MerossHttpClient.async_from_user_password(email=EMAIL, password=PASSWORD)

    global manager
    manager = MerossManager(http_client=http_api_client)
    await manager.async_init()

    global devices
    await manager.async_device_discovery()
    for dev in manager.find_devices():

        # Read the device state at least once, then
        # internally uses MQTT to subscribe to later changes.
        await dev.async_update()
        devices[dev.uuid] = dev

    global ready
    ready = True


@app.on_event("shutdown")
async def shutdown_event():
    manager.close()
    await http_api_client.async_logout()


@app.get("/healthz")
async def healthz():
    global ready
    if not ready:
        raise HTTPException(status_code=503, detail="Not ready yet")
    return {"ok": True}


@app.get("/devices")
async def list_devices():
    global devices

    out = []

    for device in devices.values():
        out.append(deviceToJSON(device))

    return out


@app.get("/devices/{device_id}")
async def read_device(device_id: str):
    global devices
    if device_id not in devices:
        raise HTTPException(status_code=404)

    return deviceToJSON(devices[device_id])


@app.get("/devices/{device_id}/{channel_id}")
async def read_channel_device(device_id: str, channel_id: int):
    global devices
    if device_id not in devices:
        raise HTTPException(status_code=404)

    return deviceToJSON(devices[device_id], channel_id)


class WriteDeviceState(BaseModel):
    on: bool


class WriteDeviceDTO(BaseModel):
    state: WriteDeviceState


@app.put("/devices/{device_id}")
async def write_device(device_id: str, body: WriteDeviceDTO):
    global devices
    if device_id not in devices:
        raise HTTPException(status_code=404)

    device = devices[device_id]

    if body.state.on:
        await device.async_turn_on()
    else:
        await device.async_turn_off()

    return {
        "state": {"on": body.state.on}
    }


@app.put("/devices/{device_id}/{channel_id}")
async def write_channel_device(device_id: str, channel_id: int, body: WriteDeviceDTO):
    global devices
    if device_id not in devices:
        raise HTTPException(status_code=404)

    device = devices[device_id]

    if body.state.on:
        await device.async_turn_on(channel=channel_id)
    else:
        await device.async_turn_off(channel=channel_id)

    return {
        "state": {"on": body.state.on}
    }


def deviceToJSON(device, channel=0):
    name = device.name
    if channel is not 0:
        name = device.lookup_channel(channel).name

    return {
        "id": device.uuid,
        "channel": channel or None,
        "name": name,
        "state": {
            "reachable": device.online_status,
            "on": device.is_on(channel),
        }
    }
