const controllers = require("../controllers");

// Cruft! Should be an http call to self
// to spread load across pods.
const getDevices = require("./get-devices");

const got = require("got");
const { SERVICE_REDIS_URL } = process.env;

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const devicesRsp = await getDevices(req, res);
  await got.put(`${SERVICE_REDIS_URL}/set/device-data`, { json: devicesRsp });
  return { ok: true };
};
