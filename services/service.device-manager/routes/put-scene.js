const { SERVICE_SLACK_URL } = process.env;

const confGroups = require("../config/groups.json");
const confDevices = require("../config/devices.json");
const confScenes = require("../config/scenes.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { got } = req;
  const { id } = req.params;
  const scene = confScenes[id];
  if (!scene) return send(res, 404);

  const { groups, devices, states } = scene;

  const stateIDsByDeviceID = new Map();
  for (const deviceID in devices) {
    stateIDsByDeviceID.set(deviceID, devices[deviceID]);
  }

  for (const groupID in groups) {
    for (const deviceID of confGroups[groupID]) {
      const stateID = groups[groupID];
      stateIDsByDeviceID.set(deviceID, stateID);
    }
  }

  await Promise.all(
    [...stateIDsByDeviceID].map(([deviceID, stateID]) => {
      const device = confDevices[deviceID];
      if (!device) throw new Error(`Cannot find device ${deviceID}`);

      const state = states[stateID];
      if (!state) throw new Error(`${deviceID} can't find state ${stateID}`);

      return controllers[device.controller].write(req, device, state);
    })
  );

  // Not awaiting this as it's fine to happen after returning.
  got.post(`${SERVICE_SLACK_URL}/post-message`, {
    json: { text: `Activated scene: ${scene.name}` },
  });

  return { ok: true };
};
