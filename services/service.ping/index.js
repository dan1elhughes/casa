process.env.NODE_ENV !== "production" && require("dotenv").config();
const os = require("os");
const { send } = require("micro");
const { router, get } = require("microrouter");

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
createSet("default", [traceMW, loggerMW]);

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
