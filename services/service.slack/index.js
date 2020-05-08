const assert = require("assert");
process.env.NODE_ENV === "development" && require("dotenv").config();
assert(process.env.SLACK_WEBHOOK_URL);

const { createSet, applyMiddleware, errorHandler } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
createSet("default", [requestLoggerMiddleware]);

const { send } = require("micro");
const { router, get, post } = require("microrouter");

const postMessage = require("./routes/post-message");
const getHealthz = require("./routes/get-healthz");

module.exports = applyMiddleware(
  router(
    post("/post-message", postMessage),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404)),
    post("/*", (req, res) => send(res, 404))
  )
);
