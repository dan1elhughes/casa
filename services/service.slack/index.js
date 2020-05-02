const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SLACK_WEBHOOK_URL);

const { send } = require("micro");
const { router, get, post } = require("microrouter");

const postMessage = require("./routes/post-message");
const getHealthz = require("./routes/get-healthz");

module.exports = router(
  post("/post-message", postMessage),
  get("/healthz", getHealthz),
  get("/*", (req, res) => send(res, 404)),
  post("/*", (req, res) => send(res, 404))
);
