const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SERVICE_HUE_URL);
assert(process.env.SERVICE_IFTTT_URL);
assert(process.env.SERVICE_REDIS_URL);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getDevices = require("./routes/get-devices");
const getDevice = require("./routes/get-device");
const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");
const putStoreDeviceStates = require("./routes/put-store-device-states");

module.exports = router(
  get("/devices", getDevices),
  get("/devices/:id", getDevice),
  get("/healthz", getHealthz),
  put("/devices/:id", putDevice),
  put("/store-device-states", putStoreDeviceStates),
  get("/*", (req, res) => send(res, 404))
);
