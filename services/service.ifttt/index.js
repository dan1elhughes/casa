const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.IFTTT_KEY);

const {
  logger,
  withRequestLogger,
} = require("@dan1elhughes/micro-loggly").configure(process.env);

require("isomorphic-fetch");

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getHealthz = require("./routes/get-healthz");
const putDevice = require("./routes/put-device");

module.exports = withRequestLogger(
  router(
    get("/healthz", getHealthz),
    put("/devices/:device", putDevice),
    get("/*", (req, res) => send(res, 404))
  )
);
