process.env.NODE_ENV !== "production" && require("dotenv").config();

const registerMiddleware = require("@casa/lib-common-middleware");
const applyMiddleware = registerMiddleware(process.env);

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const putTick = require("./routes/put-tick.js");
const getHealthz = require("./routes/get-healthz");

module.exports = applyMiddleware(
  router(
    put("/tick", putTick),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404)),
    put("/*", (req, res) => send(res, 404))
  )
);
