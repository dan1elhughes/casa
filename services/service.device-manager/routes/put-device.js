const devices = require("../config/devices.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

const { locked } = require("./utils");

module.exports = async (req, res) => {
  const { id } = req.params;
  const device = devices[id];
  if (!device) return send(res, 404);

  if (await locked(req, id)) {
    return {
      locked: true,
    };
  }

  const { state } = await json(req);

  return controllers[device.controller].write(req, device, state);
};
