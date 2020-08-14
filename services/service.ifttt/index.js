process.env.NODE_ENV !== "production" && require("dotenv").config();
const assert = require("assert");
assert(process.env.IFTTT_KEY);

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
createSet("default", [traceMW, loggerMW]);

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
