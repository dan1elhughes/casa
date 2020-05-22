const { send, json } = require("micro");

const { SERVICE_DEVICE_MANAGER_URL } = process.env;

const scenes = require("../config/scenes.json");

module.exports = async (req, res) => {
  const { got } = req;
  const body = await json(req);
  const { device, group, scene, state } = body;

  if (scene) {
    return got.put(`${SERVICE_DEVICE_MANAGER_URL}/scenes/${scene}`);
  }

  if (device) {
    return got.put(`${SERVICE_DEVICE_MANAGER_URL}/devices/${device}`, {
      json: { state },
    });
  }

  if (group) {
    return got.put(`${SERVICE_DEVICE_MANAGER_URL}/groups/${group}`, {
      json: { state },
    });
  }

  return send(res, 404);
};
