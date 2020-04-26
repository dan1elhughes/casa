const { json } = require("micro");

const rsmq = require("../queue/rsmq");

const { promisify } = require("util");
function async(client, method) {
  return promisify(client[method]).bind(client);
}

module.exports = async (req, res) => {
  const { key } = req.params;
  const value = await json(req);

  // Hack: Extract the redis instance out of the rsmq
  // instance we've already set up for the worker.
  const instance = await rsmq.instance();
  const { redis } = instance.rsmq;

  const set = async(redis, "set");
  await set(key, JSON.stringify(value));

  return { key };
};
