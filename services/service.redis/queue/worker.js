const RSMQWorker = require("rsmq-worker");
const rsmq = require("./rsmq");

const { QUEUE_NAME } = require("./constants");

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

    instance.on("message", (msg, done, id) => {
      console.log(("MSG RECV": msg));
      done();
    });

    instance.on("ready", () => console.log("Ready!"));
    instance.on("error", (err, msg) => console.log(err.message, msg.id));
    instance.on("exceeded", (msg) => console.log(msg.id));
    instance.on("timeout", (msg) => console.log(msg.id, msg.rc));
  }

  return instance;
};
