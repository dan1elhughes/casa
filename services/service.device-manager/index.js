const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SERVICE_DEVICE_MANAGER_URL);
assert(process.env.SERVICE_HUE_URL);
assert(process.env.SERVICE_IFTTT_URL);
assert(process.env.SERVICE_REDIS_URL);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getDevices = require("./routes/get-devices");
const getDevice = require("./routes/get-device");
const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");
const putGroup = require("./routes/put-group");
const putScene = require("./routes/put-scene");
const putEvent = require("./routes/put-event");
const putStoreDeviceStates = require("./routes/put-store-device-states");
const putEvaluateSceneTriggers = require("./routes/put-evaluate-scene-triggers");

module.exports = router(
  get("/devices", getDevices),
  get("/devices/:id", getDevice),
  put("/devices/:id", putDevice),
  put("/groups/:id", putGroup),
  put("/scenes/:id", putScene),
  put("/event", putEvent),
  get("/healthz", getHealthz),
  put("/store-device-states", putStoreDeviceStates),
  put("/evaluate-scene-triggers", putEvaluateSceneTriggers),
  get("/*", (req, res) => send(res, 404)),
  put("/*", (req, res) => send(res, 404))
);
