const groups = require("../config/groups.json");
const devices = require("../config/devices.json");

const controllers = require("../controllers");

const { send, json } = require("micro");

const { locked } = require("./utils");

module.exports = async (req, res) => {
  const { id } = req.params;
  const group = groups[id];
  if (!group) return send(res, 404);

  const { state } = await json(req);

  await Promise.all(
    group.map(async (id) => {
      const device = devices[id];

      if (await locked(req, id)) {
        return {
          locked: true,
        };
      }

      return controllers[device.controller].write(req, device, state);
    })
  );

  return { ok: true };
};
