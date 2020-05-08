process.env.NODE_ENV === "development" && require("dotenv").config();
const os = require("os");
const { send } = require("micro");
const { router, get } = require("microrouter");

const { createSet, applyMiddleware, errorHandler } = require("micro-mw");
const configureLogger = require("@dan1elhughes/micro-loggly");
const { logger, requestLoggerMiddleware } = configureLogger(process.env);
createSet("default", [requestLoggerMiddleware]);

module.exports = applyMiddleware(
  router(
    get("/healthz", () => ({ ok: true })),

    get("/", () => ({
      ping: "pong",
      hostname: os.hostname(),
    })),

    get("/*", (req, res) => send(res, 404))
  )
);
