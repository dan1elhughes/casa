const os = require("os");
const { send } = require("micro");
const { router, get } = require("microrouter");

module.exports = router(
  get("/healthz", () => ({ ok: true })),

  get("/", () => ({
    ping: "pong",
    hostname: os.hostname(),
  })),

  get("/*", (req, res) => send(res, 404))
);
