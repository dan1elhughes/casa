process.env.NODE_ENV !== "production" && require("dotenv").config();
const os = require("os");
const { send } = require("micro");
const { router, get, put } = require("microrouter");

const registerMiddleware = require("@casa/lib-common-middleware");
const applyMiddleware = registerMiddleware(process.env);

const putStart = require("./routes/put_start");
const putFinish = require("./routes/put_finish");

module.exports = applyMiddleware(
  router(
    get("/healthz", () => ({ ok: true })),

    put("/start", putStart),
    put("/finish", putFinish),
    put("/fail", () => ({ ok: true })) // TODO: This!
  )
);
