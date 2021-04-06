const { send } = require("micro");
const os = require("os");

module.exports = (env) => {
  ["NODE_ENV", "npm_package_name", "SENTRY_DSN"].forEach((key) => {
    if (!env[key]) throw new Error(`Missing argument: ${key}`);
  });

  const isProd = env.NODE_ENV === "production";

  const Sentry = require("@sentry/node");

  if (isProd) {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      serverName: os.hostname(),
      environment: env.NODE_ENV,
    });

    Sentry.setTag("service", env.npm_package_name);
  }

  // Adapted from https://github.com/mhamann/micro-mw/blob/master/lib/errorHandler.js
  return function errorCaptureMiddleware(req, res, err) {
    if (isProd) {
      Sentry.captureException(err);
    }

    send(res, err.statusCode || err.status || 500, err.body || err.message);

    console.error(
      `${req.method} ${req.url} - Error ${
        err.status || err.statusCode || 500
      }: ${err.body || err.message}`,
      err.stack
    );
  };
};
