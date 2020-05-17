const { json } = require("micro");

const rsmq = require("../queue/rsmq");

const { async } = require("./utils");

module.exports = async (req, res) => {
  const { name, key } = req.params;
  const value = await json(req);

  const instance = await rsmq.instance();
  const { redis } = instance.rsmq;

  const hset = async(redis, "hset");
  await hset(name, key, JSON.stringify(value));

  return { key, value };
};
