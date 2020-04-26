const RedisSMQ = require("rsmq-promise");
const redis = require("redis");

const { QUEUE_NAME } = require("./constants");

let url;
let instance;

module.exports.configure = (configUrl) => {
  url = configUrl;
};

module.exports.instance = async () => {
  if (!url) {
    throw new Error("Missing URL to load publisher");
  }

  if (!instance) {
    console.log("Instantiating publisher instance");

    const client = redis.createClient(url);
    instance = new RedisSMQ({ client });

    const queues = await instance.listQueues();
    if (!queues.includes(QUEUE_NAME)) {
      instance.createQueue({ qname: QUEUE_NAME });
    }
  }
  return instance;
};
