const { send, json } = require("micro");

const scenes = require("../config/scenes.json");

module.exports = async (req, res) => {
  const { got, getServiceURL } = req;
  const body = await json(req);
  const { device, group, scene, state } = body;

  const deviceManagerService = getServiceURL("service.device-manager");

  if (scene) {
    return got.put(`${deviceManagerService}/scenes/${scene}`);
  }

  if (device) {
    return got.put(`${deviceManagerService}/devices/${device}`, {
      json: { state },
    });
  }

  if (group) {
    return got.put(`${deviceManagerService}/groups/${group}`, {
      json: { state },
    });
  }

  return send(res, 404);
};
