const controllers = require("../controllers");

const devices = require("../config/devices.json");
const groups = require("../config/groups.json");
const scenes = require("../config/scenes.json");

// Cruft! Should be an http call to self
// to spread load across pods.
const getDevices = require("./get-devices");

const { SERVICE_REDIS_URL } = process.env;

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { got } = req;
  const devices = await getDevices(req, res);
  await got.put(`${SERVICE_REDIS_URL}/set/device-data`, {
    json: { devices, groups, scenes },
  });
  return { ok: true };
};
