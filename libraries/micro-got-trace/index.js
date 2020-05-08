const got = require("got");
const { v4: uuid } = require("uuid");

const TRACE_HEADER_KEY = "x-trace-id";

module.exports = (env) => {
  ["NODE_ENV"].forEach((key) => {
    if (!env[key]) throw new Error(`Missing argument: ${key}`);
  });

  function gotMiddleware(req, res) {
    const traceId = req.headers[TRACE_HEADER_KEY] || uuid();

    // Consumers of the middleware should use this instance
    // to pass the header onto downstream requests.
    const headers = { [TRACE_HEADER_KEY]: traceId };
    req.got = got.extend({ headers });

    // So that the first request in the chain can access the trace ID
    // even though it wasn't in the request headers.
    req.traceId = traceId;

    // We also write the header into the response, so we
    // can see what trace to search for when making API
    // calls.
    res.setHeader(TRACE_HEADER_KEY, traceId);
  }

  return {
    gotMiddleware,
    TRACE_HEADER_KEY,
  };
};
