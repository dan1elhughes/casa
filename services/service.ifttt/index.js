process.env.NODE_ENV !== "production" && require("dotenv").config();
const assert = require("assert");
assert(process.env.IFTTT_KEY);

const registerMiddleware = require("@casa/lib-common-middleware");
const applyMiddleware = registerMiddleware(process.env);

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
