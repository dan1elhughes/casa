const RSMQWorker = require("rsmq-worker");
const rsmq = require("./rsmq");

const { QUEUE_NAME } = require("./constants");

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
    });

    instance.on("message", async (msg, done, id) => {
      const content = JSON.parse(msg);
      const { destination, body, traceId } = content;

      // CRUFT!
      let service = {
        "device-manager": `http://service-device-manager.default.svc.cluster.local:3000`,
      }[destination];

      if (service) {
        const headers = { "x-trace-id": traceId };
        await got.put(`${service}/event`, { headers, json: body }).json();
      } else {
        console.log(`Unconfigured destination ${destination}`);
      }

      done();
    });

    instance.on("ready", () => console.log("Ready!"));
    instance.on("error", (err, msg) =>
      console.log("error", err.message, msg.id)
    );
    instance.on("exceeded", (msg) => console.log("exceeded", msg.id));
    instance.on("timeout", (msg) => console.log("timeout", msg.id, msg.rc));
  }

  return instance;
};
