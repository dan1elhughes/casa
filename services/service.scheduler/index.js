const assert = require("assert");
process.env.NODE_ENV !== "production" && require("dotenv").config();
assert(process.env.SERVICE_DEVICE_MANAGER_URL);
assert(process.env.SERVICE_REDIS_URL);

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
const errorMW = require("@casa/lib-error-tracking")(process.env);
createSet("default", [traceMW, loggerMW]);
createSet("errorHandler", [errorMW]);

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
