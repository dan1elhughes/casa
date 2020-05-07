const winston = require("winston");
const assert = require("assert");
const { Loggly } = require("winston-loggly-bulk");

module.exports.configure = ({
  LOGGLY_SUBDOMAIN,
  LOGGLY_TOKEN,
  NODE_ENV,
  npm_package_name,
}) => {
  assert(LOGGLY_SUBDOMAIN);
  assert(LOGGLY_TOKEN);
  assert(NODE_ENV);
  assert(npm_package_name);

  const logger = winston.createLogger({
    level: "debug",
    transports: [
      new winston.transports.Console(),
      new Loggly({
        token: LOGGLY_TOKEN,
        subdomain: LOGGLY_SUBDOMAIN,
        tags: [`node-env-${NODE_ENV}`, npm_package_name],
        json: true,
      }),
    ],
  });

  const withRequestLogger = (fn) => async (req, res) => {
    const { url, method } = req;
    const { host } = req.headers;

    logger.debug(`${host} -> ${method} ${npm_package_name} ${url}`);
    return fn(req, res);
  };

  return {
    logger,
    withRequestLogger,
  };
};
