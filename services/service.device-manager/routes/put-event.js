const { send, json } = require("micro");

const got = require("got");
const { SERVICE_DEVICE_MANAGER_URL } = process.env;

const scenes = require("../config/scenes.json");

module.exports = async (req, res) => {
  const body = await json(req);
  const { scene } = body;
  return got.put(`${SERVICE_DEVICE_MANAGER_URL}/scenes/${scene}`);
};
