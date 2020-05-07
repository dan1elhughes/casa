const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.REDIS_URL);
assert(process.env.SERVICE_DEVICE_MANAGER_URL);

const {
  logger,
  withRequestLogger,
} = require("@dan1elhughes/micro-loggly").configure(process.env);

const rsmq = require("./queue/rsmq");
rsmq.configure(process.env.REDIS_URL);

const worker = require("./queue/worker");
worker.instance().then((w) => w.start());

const { send } = require("micro");
const { router, get, put, del } = require("microrouter");

const getKey = require("./routes/get-key");
const putKey = require("./routes/put-key");
const deleteKey = require("./routes/delete-key");
const putEvent = require("./routes/put-event");
const getHealthz = require("./routes/get-healthz");

module.exports = withRequestLogger(
  router(
    get("/get/:key", getKey),
    put("/set/:key", putKey),
    del("/delete/:key", deleteKey),
    put("/event", putEvent),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404))
  )
);
