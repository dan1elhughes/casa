const groups = require("../config/groups.json");
const devices = require("../config/devices.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { id } = req.params;
  const group = groups[id];
  if (!group) return send(res, 404);

  const { state } = await json(req);

  await Promise.all(
    group.map((id) => {
      const device = devices[id];
      return controllers[device.controller].write(device, state);
    })
  );

  return { ok: true };
};
