const { json } = require("micro");

const rsmq = require("../queue/rsmq");
const { QUEUE_NAME } = require("../queue/constants");

module.exports = async (req, res) => {
  const body = await json(req);
  const instance = await rsmq.instance();
  return instance.sendMessage({
    qname: QUEUE_NAME,
    message: JSON.stringify(body),
  });
};
