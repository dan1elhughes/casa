const { send, json } = require("micro");

const scenes = require("../config/scenes.json");

module.exports = async (req, res) => {
  const { got, getServiceURL } = req;
  const body = await json(req);
  const { device, group, scene, state } = body;

  const deviceManagerService = getServiceURL("service.device-manager");

  // Don't fail in the event consumer, otherwise we get into retry loops if an
  // event says we need to set state X but one of the lights in that scene is
  // dead. We await here to make sure we evaluate the promise rejections
  // immediately, not throw them up to the caller.
  try {
    if (scene) {
      return await got.put(`${deviceManagerService}/scenes/${scene}`);
    }

    if (device) {
      return await got.put(`${deviceManagerService}/devices/${device}`, {
        json: { state },
      });
    }

    if (group) {
      return await got.put(`${deviceManagerService}/groups/${group}`, {
        json: { state },
      });
    }
  } catch (e) {
    console.error(e);
    return { error: e.toString() };
  }

  return send(res, 404);
};
