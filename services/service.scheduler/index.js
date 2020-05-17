const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SERVICE_DEVICE_MANAGER_URL);
assert(process.env.SERVICE_REDIS_URL);

const { createSet, applyMiddleware, errorHandler } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
const configureTrace = require("@dan1elhughes/micro-got-trace");
const { gotMiddleware } = configureTrace(process.env);
createSet("default", [gotMiddleware, requestLoggerMiddleware]);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const putTick = require("./routes/put-tick.js");
const getHealthz = require("./routes/get-healthz");

module.exports = applyMiddleware(
  router(
    put("/tick", putTick),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404)),
    put("/*", (req, res) => send(res, 404))
  )
);
