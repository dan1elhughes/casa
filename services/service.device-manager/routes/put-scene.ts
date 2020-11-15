import config from "../config";

// import controllers from "../controllers";

import { send, json, RequestHandler } from "micro";
import { ServerResponse } from "http";
import { StatusCodes } from "http-status-codes";

import { postSendMessage } from "@casa/service.slack/requests";
import { IncomingMessage } from "@casa/lib-requests";

interface Request extends IncomingMessage {
  params: {
    id: string;
  };
}

export default async (req: Request, res: ServerResponse) => {
  let scenes;

  try {
    scenes = config.scenes();
  } catch (e) {
    console.error(e);
    return send(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: e.message,
    });
  }

  const { id } = req.params;
  const scene = scenes[id];
  if (!scene) return send(res, StatusCodes.NOT_FOUND);

  // const { groups, devices, states } = scene;

  // const stateIDsByDeviceID = new Map();
  // for (const deviceID in devices) {
  //   stateIDsByDeviceID.set(deviceID, devices[deviceID]);
  // }

  // for (const groupID in groups) {
  //   for (const deviceID of confGroups[groupID]) {
  //     const stateID = groups[groupID];
  //     stateIDsByDeviceID.set(deviceID, stateID);
  //   }
  // }

  // await Promise.all(
  //   [...stateIDsByDeviceID].map(([deviceID, stateID]) => {
  //     const device = confDevices[deviceID];
  //     if (!device) throw new Error(`Cannot find device ${deviceID}`);

  //     const state = states[stateID];
  //     if (!state) throw new Error(`${deviceID} can't find state ${stateID}`);

  //     return controllers[device.controller].write(req, device, state);
  //   })
  // );

  const response = await postSendMessage.send(req, {
    text: `Activated scene: ${scene.name}`,
  });
  console.log(response);

  return { ok: true };
};
