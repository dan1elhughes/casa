process.env.NODE_ENV !== "production" && require("dotenv").config();

const os = require("os");
const { send } = require("micro");
const { router, get, put } = require("microrouter");

const makeMiddleware = require("@casa/lib-common-middleware");
const applyMiddleware = makeMiddleware(process.env);

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
