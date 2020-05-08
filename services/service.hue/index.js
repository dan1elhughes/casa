const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.HUE_IP);
assert(process.env.HUE_USER);
assert(process.env.HUE_KEY);

const { createSet, applyMiddleware } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
const configureTrace = require("@dan1elhughes/micro-got-trace");
const { gotMiddleware } = configureTrace(process.env);
createSet("default", [gotMiddleware, requestLoggerMiddleware]);

const getApi = require("./api");

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getHealthz = require("./routes/get-healthz");
const getLight = require("./routes/get-light");
const getLights = require("./routes/get-lights");
const putLight = require("./routes/put-light");

module.exports = applyMiddleware(
  router(
    get("/healthz", getHealthz),
    get("/lights/:id", getLight),
    get("/lights", getLights),
    put("/lights/:id", putLight),

    get("/*", (req, res) => send(res, 404))
  )
);
