const { send } = require("micro");
const rsmq = require("../queue/rsmq");

const { async } = require("./utils");

module.exports = async (req, res) => {
  const { name, key } = req.params;

  const instance = await rsmq.instance();
  const { redis } = instance.rsmq;

  const hdel = async(redis, "hdel");

  // Not checking return value to make this idempotent
  await hdel(name, key);
  return { ok: true };
};
