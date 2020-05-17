const rsmq = require("../queue/rsmq");

const { async } = require("./utils");

module.exports = async (req, res) => {
  const { name, key } = req.params;

  const instance = await rsmq.instance();
  const { redis } = instance.rsmq;

  const hget = async(redis, "hget");
  return hget(name, key);
};
