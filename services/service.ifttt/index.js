const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.IFTTT_KEY);

const { createSet, applyMiddleware, errorHandler } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
const configureTrace = require("@dan1elhughes/micro-got-trace");
const { gotMiddleware } = configureTrace(process.env);
createSet("default", [gotMiddleware, requestLoggerMiddleware]);

require("isomorphic-fetch");

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");

module.exports = applyMiddleware(
  router(
    get("/healthz", getHealthz),
    put("/devices/:device", putDevice),
    get("/*", (req, res) => send(res, 404))
  )
);
