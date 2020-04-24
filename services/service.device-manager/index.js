const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SERVICE_HUE_URL);
assert(process.env.SERVICE_IFTTT_URL);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getDevice = require("./routes/get-device");
const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");

module.exports = router(
  get("/devices/:id", getDevice),
  get("/healthz", getHealthz),
  put("/devices/:id", putDevice),
  get("/*", (req, res) => send(res, 404))
);
