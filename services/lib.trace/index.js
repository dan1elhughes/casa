const os = require("os");
const got = require("got");

const { v4: uuid } = require("uuid");

const TRACE_HEADER_KEY = "x-trace-id";
const REQUEST_SOURCE_KEY = "x-request-source";

module.exports = (env) => {
  ["NODE_ENV", "npm_package_name"].forEach((key) => {
    if (!env[key]) throw new Error(`Missing argument: ${key}`);
  });

  return function traceMiddleware(req, res) {
    const traceId = req.headers[TRACE_HEADER_KEY] || uuid();

    // Consumers of the middleware should use this instance
    // to pass the header onto downstream requests.
    const headers = {
      [TRACE_HEADER_KEY]: traceId,
      [REQUEST_SOURCE_KEY]: env.npm_package_name,
      "user-agent": `${os.hostname()}/${env.npm_package_name} (${
        env.NODE_ENV
      })`,
    };

    req.got = got.extend({ headers });

    // So that the first request in the chain can access the trace ID
    // even though it wasn't in the request headers.
    req.traceId = traceId;

    // We also write the header into the response, so we
    // can see what trace to search for when making API
    // calls.
    res.setHeader(TRACE_HEADER_KEY, traceId);
  };
};

module.exports.TRACE_HEADER_KEY = TRACE_HEADER_KEY;
