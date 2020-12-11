const devices = require("../config/devices.json");

const controllers = require("../controllers");

const { send } = require("micro");

async function readDevice(req, id, device) {
  const controller = controllers[device.controller];
  return {
    [id]: await controller.read(req, device),
  };
}

function flattenObjects(arrayOfObjects) {
  return arrayOfObjects.reduce(
    (obj, accumulator) => ({ ...accumulator, ...obj }),
    {}
  );
}

module.exports = async (req, res) => {
  const responses = await Promise.all(
    Object.entries(devices).map(([id, device]) => readDevice(req, id, device))
  );

  return flattenObjects(responses);
};
