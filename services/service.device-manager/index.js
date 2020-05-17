process.env.NODE_ENV === "development" && require("dotenv").config();

const { createSet, applyMiddleware } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
const configureTrace = require("@dan1elhughes/micro-got-trace");
const { gotMiddleware } = configureTrace(process.env);
createSet("default", [gotMiddleware, requestLoggerMiddleware]);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getDevices = require("./routes/get-devices");
const getDevice = require("./routes/get-device");
const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");
const putLockDevice = require("./routes/put-lock-device");
const putGroup = require("./routes/put-group");
const putScene = require("./routes/put-scene");
const putEvent = require("./routes/put-event");
const putStoreDeviceStates = require("./routes/put-store-device-states");

module.exports = applyMiddleware(
  router(
    get("/devices", getDevices),
    get("/devices/:id", getDevice),
    put("/locks/:id/:isLocked", putLockDevice),
    put("/devices/:id", putDevice),
    put("/groups/:id", putGroup),
    put("/scenes/:id", putScene),
    put("/event", putEvent),
    get("/healthz", getHealthz),
    put("/store-device-states", putStoreDeviceStates),
    get("/*", (req, res) => send(res, 404)),
    put("/*", (req, res) => send(res, 404))
  )
);
