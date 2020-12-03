const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const assert = require("assert");
const { SENTRY_DSN } = process.env;
assert(SENTRY_DSN);

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

module.exports = Sentry;
