const confGroups = require("../config/groups.json");
const confDevices = require("../config/devices.json");
const confScenes = require("../config/scenes.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

const finishSpan = (span) => (value) => {
  span.finish();
  return value;
};

module.exports = async (req, res) => {
  const { got, Sentry, getServiceURL } = req;
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

  const transaction = Sentry.startTransaction({
    op: "transaction",
    name: `Scene: ${scene.name}`,
  });

  await Promise.all(
    [...stateIDsByDeviceID].map(([deviceID, stateID]) => {
      const span = transaction.startChild({
        op: "write",
        description: `Write device: ${deviceID}`,
      });

      const device = confDevices[deviceID];
      if (!device) throw new Error(`Cannot find device ${deviceID}`);

      const state = states[stateID];
      if (!state) throw new Error(`${deviceID} can't find state ${stateID}`);

      return controllers[device.controller]
        .write(req, device, state)
        .then(finishSpan(span));
    })
  );

  transaction.finish();

  const slackService = getServiceURL("service.slack");

  // Not awaiting this as it's fine to happen after returning.
  got.post(`${slackService}/post-message`, {
    json: { text: `Activated scene: ${scene.name}` },
  });

  return { ok: true };
};
