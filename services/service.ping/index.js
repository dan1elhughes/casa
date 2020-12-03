process.env.NODE_ENV !== "production" && require("dotenv").config();
const os = require("os");
const { send } = require("micro");
const { router, get, put } = require("microrouter");

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
const errorMW = require("@casa/lib-error-tracking")(process.env);
createSet("default", [traceMW, loggerMW]);
createSet("errorHandler", [errorMW]);

module.exports = applyMiddleware(
  router(
    get("/healthz", () => ({ ok: true })),

    get("/", () => ({
      ping: "pong",
      hostname: os.hostname(),
    })),

    get("/*", (req, res) => send(res, 404)),

    put("/throw", () => {
      throw new Error("Table flipped");
    })
  )
);
