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

const finishSpan = (span) => (value) => {
  span.finish();
  return value;
};

module.exports = async (req, res) => {
  const { Sentry } = req;

  const transaction = Sentry.startTransaction({
    op: "transaction",
    name: `Store device states`,
  });

  const responses = await Promise.all(
    Object.entries(devices).map(([id, device]) => {
      const span = transaction.startChild({
        op: "read",
        description: `Read device: ${device.name}`,
      });

      return readDevice(req, id, device).then(finishSpan(span));
    })
  );

  transaction.finish();

  return flattenObjects(responses);
};
