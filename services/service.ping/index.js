process.env.NODE_ENV === "development" && require("dotenv").config();
const os = require("os");
const { send } = require("micro");
const { router, get } = require("microrouter");

const {
  logger,
  withRequestLogger,
} = require("@dan1elhughes/micro-loggly").configure(process.env);

module.exports = withRequestLogger(
  router(
    get("/healthz", () => ({ ok: true })),

    get("/", () => ({
      ping: "pong",
      hostname: os.hostname(),
    })),

    get("/*", (req, res) => send(res, 404))
  )
);
