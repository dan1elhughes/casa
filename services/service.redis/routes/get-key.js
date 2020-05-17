const rsmq = require("../queue/rsmq");

const { async } = require("./utils");

module.exports = async (req, res) => {
  const { key } = req.params;

  // Hack: Extract the redis instance out of the rsmq
  // instance we've already set up for the worker.
  const instance = await rsmq.instance();
  const { redis } = instance.rsmq;

  const get = async(redis, "get");
  return get(key);
};
