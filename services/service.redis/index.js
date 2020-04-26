const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.REDIS_URL);

const rsmq = require("./queue/rsmq");
rsmq.configure(process.env.REDIS_URL);

const { send } = require("micro");
const { router, get, put, del } = require("microrouter");

const getKey = require("./routes/get-key");
const putKey = require("./routes/put-key");
const deleteKey = require("./routes/delete-key");
const getHealthz = require("./routes/get-healthz");

module.exports = router(
  get("/get/:key", getKey),
  put("/set/:key", putKey),
  del("/delete/:key", deleteKey),
  get("/healthz", getHealthz),
  get("/*", (req, res) => send(res, 404))
);
