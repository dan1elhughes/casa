const rsmq = require("../queue/rsmq");

module.exports = async (req, res) => {
  const instance = await rsmq.instance();
  if (!instance.rsmq.redis.connected) {
    throw new Error("Not connected to Redis instance");
  }

  return { ok: true };
};
