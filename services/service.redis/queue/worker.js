const errorTracking = require("@casa/lib-error-tracking");

const RSMQWorker = require("rsmq-worker");
const rsmq = require("./rsmq");

const { QUEUE_NAME } = require("./constants");

const { SERVICE_DEVICE_MANAGER_URL } = process.env;
const got = require("got");

let instance;

module.exports.instance = async () => {
  if (!instance) {
    console.log("Instantiating worker instance");

    const rsmqInstance = await rsmq.instance();
    const interval = [0, 0.25, 0.5, 1];

    instance = new RSMQWorker(QUEUE_NAME, {
      rsmq: rsmqInstance.rsmq,
      interval,
      maxReceiveCount: 3,
    });

    instance.on("message", async (msg, done, id) => {
      const content = JSON.parse(msg);
      const { destination, body, traceId } = content;

      let service = {
        "device-manager": SERVICE_DEVICE_MANAGER_URL,
      }[destination];

      try {
        if (service) {
          const headers = { "x-trace-id": traceId };
          await got.put(`${service}/event`, { headers, json: body }).json();
        } else {
          throw new Error(`Unconfigured destination ${destination}`);
        }
      } catch (e) {
        errorTracking.captureException(e);
      } finally {
        done();
      }
    });

    instance.on("ready", () => console.log("Ready!"));
    instance.on("error", errorTracking.captureException);
    instance.on("exceeded", (msg) => console.log("exceeded", msg.id));
    instance.on("timeout", (msg) => console.log("timeout", msg.id, msg.rc));
  }

  return instance;
};
