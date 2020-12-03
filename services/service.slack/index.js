const assert = require("assert");
process.env.NODE_ENV !== "production" && require("dotenv").config();
assert(process.env.SLACK_WEBHOOK_URL);

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
const errorMW = require("@casa/lib-error-tracking")(process.env);
createSet("default", [traceMW, loggerMW]);
createSet("errorHandler", [errorMW]);

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
