from app import app
from meross_iot.cloud.devices.power_plugs import GenericPlug
from meross_iot.manager import MerossManager
from meross_iot.meross_event import MerossEventType
from random import randint
import atexit
import os
import time
from flask import jsonify


EMAIL = os.environ.get('MEROSS_EMAIL') or "YOUR_MEROSS_CLOUD_EMAIL"
PASSWORD = os.environ.get('MEROSS_PASSWORD') or "YOUR_MEROSS_CLOUD_PASSWORD"

manager = MerossManager.from_email_and_password(
    meross_email=EMAIL, meross_password=PASSWORD)


# Starts the manager
manager.start()


def stopManager():
    print("Stopping manager...")
    manager.stop()
    print("Stopped")


atexit.register(stopManager)


def to_dict(plug):
    res = {}
    res['uuid'] = plug.uuid
    res['name'] = plug.name
    res['type'] = plug.type
    res['fwversion'] = plug.fwversion
    res['hwversion'] = plug.hwversion
    res['online'] = plug.online
    res['channels'] = []

    channels = plug.get_channels()
    print(len(channels))

    # for i in range(0, len(plug.get_channels())):
    #     res['channels'][i] = plug.get_channel_status(i)

    return res


@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/plugs')
def plugs():
    res = {}
    for p in manager.get_devices_by_kind(GenericPlug):
        num_channels = len(p.get_channels())
        for i in range(0, num_channels):
            plug = {}
            id = "{}.{}".format(p.uuid, i)
            plug['uuid'] = p.uuid
            plug['channel'] = i
            plug['online'] = p.online
            plug['status'] = p.get_channel_status(i)

            if i == 0:
                plug['name'] = p.name
            else:
                plug['name'] = p.get_channels()[i]['devName']

            res[id] = plug

    return jsonify(res)


@app.route('/plugs/<id>/<power>', methods=['PUT'])
def set_power(id, power):
    uuid, channel = id.split('.')
    device = manager.get_device_by_uuid(uuid)

    if power == 'on':
        device.turn_on_channel(int(channel))
    else:
        device.turn_off_channel(int(channel))

    return jsonify(success=True)
