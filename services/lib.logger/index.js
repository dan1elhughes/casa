const winston = require("winston");

const REQUEST_LOG_LEVEL = "debug";

module.exports = (env) => {
  ["NODE_ENV", "npm_package_name"].forEach((key) => {
    if (!env[key]) throw new Error(`Missing argument: ${key}`);
  });

  const logger = winston.createLogger({
    level: REQUEST_LOG_LEVEL,
    transports: [new winston.transports.Console()],
  });

  return function requestLoggerMiddleware(req) {
    req.logger = logger;

    const { url, method } = req;
    const requestSource = req.headers["x-request-source"] || "";

    const message = {
      level: REQUEST_LOG_LEVEL,
      message: `${requestSource} -> ${method} ${env.npm_package_name} ${url}`,
    };

    // May be undefined if not using @dan1elhughes/micro-got-trace.
    // Using .traceId instead of req.headers[...] because the first
    // request in the chain will have the former but not the latter.
    if (req.traceId) {
      message.traceId = req.traceId;
    }

    logger.log(message);
  };
};
