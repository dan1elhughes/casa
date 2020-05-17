const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.REDIS_URL);
assert(process.env.SERVICE_DEVICE_MANAGER_URL);

const { createSet, applyMiddleware, errorHandler } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
const configureTrace = require("@dan1elhughes/micro-got-trace");
const { gotMiddleware } = configureTrace(process.env);
createSet("default", [gotMiddleware, requestLoggerMiddleware]);

const rsmq = require("./queue/rsmq");
rsmq.configure(process.env.REDIS_URL);

const worker = require("./queue/worker");
worker.instance().then((w) => w.start());

const { send } = require("micro");
const { router, get, put, del } = require("microrouter");

const getKey = require("./routes/get-key");
const putKey = require("./routes/put-key");
const getHash = require("./routes/get-hash-key");
const putHash = require("./routes/put-hash-key");
const deleteHash = require("./routes/delete-hash-key");
const deleteKey = require("./routes/delete-key");
const putEvent = require("./routes/put-event");
const getHealthz = require("./routes/get-healthz");

module.exports = applyMiddleware(
  router(
    get("/get/:key", getKey),
    put("/set/:key", putKey),
    get("/hash/get/:name/:key", getHash),
    put("/hash/set/:name/:key", putHash),
    del("/hash/delete/:name/:key", deleteHash),
    del("/delete/:key", deleteKey),
    put("/event", putEvent),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404)),
    put("/*", (req, res) => send(res, 404))
  )
);
