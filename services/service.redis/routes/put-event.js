const { json } = require("micro");

const rsmq = require("../queue/rsmq");
const { QUEUE_NAME } = require("../queue/constants");
const { TRACE_HEADER_KEY } = require("@dan1elhughes/micro-got-trace")(
  process.env
);

module.exports = async (req, res) => {
  const traceId = req[headers][TRACE_HEADER_KEY];
  const body = await json(req);
  const instance = await rsmq.instance();
  return instance.sendMessage({
    qname: QUEUE_NAME,
    message: JSON.stringify({ ...body, traceId }),
  });
};
