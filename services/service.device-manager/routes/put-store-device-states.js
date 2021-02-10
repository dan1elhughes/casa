const Healthcheck = require("@casa/lib-healthcheck");

const controllers = require("../controllers");

const devices = require("../config/devices.json");
const groups = require("../config/groups.json");
const scenes = require("../config/scenes.json");

// Cruft! Should be an http call to self
// to spread load across pods.
const getDevices = require("./get-devices");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { got, getServiceURL } = req;

  const check = new Healthcheck(req, "store_device_states", "* * * * *");
  await check.start();

  const devices = await getDevices(req, res);

  const redisService = getServiceURL("service.redis");
  await got.put(`${redisService}/set/device-data`, {
    json: { devices, groups, scenes },
  });

  await check.finish();

  return { ok: true };
};
