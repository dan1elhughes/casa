const devices = require("../config/devices.json");
// const groups = require('../config/groups.json')
// const themes = require('../config/themes.json')

const controllers = require("../controllers");

const { send } = require("micro");

module.exports = async (req, res) => {
  const { id } = req.params;
  const device = devices[id];
  if (!device) return send(res, 404);

  const controller = controllers[device.controller];

  return controller.read(req, device);
};
