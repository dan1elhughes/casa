process.env.NODE_ENV !== "production" && require("dotenv").config();

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
const errorMW = require("@casa/lib-error-tracking")(process.env);
createSet("default", [traceMW, loggerMW]);
createSet("errorHandler", [errorMW]);

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
