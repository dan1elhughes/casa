const devices = require("../config/devices.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { id } = req.params;
  const device = devices[id];
  if (!device) send(res, 404);

  const { state } = await json(req);

  return controllers[device.controller].write(device, state);
};
