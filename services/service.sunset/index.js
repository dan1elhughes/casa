process.env.NODE_ENV !== "production" && require("dotenv").config();

const os = require("os");
const { send } = require("micro");
const { router, get } = require("microrouter");

const makeMiddleware = require("@casa/lib-common-middleware");
const applyMiddleware = makeMiddleware(process.env);

const getSunset = require("./routes/get-sunset");
const getHealthz = require("./routes/get-healthz");

module.exports = applyMiddleware(
  router(
    get("/sunset", getSunset),
    get("/healthz", getHealthz),
    get("/*", (req, res) => send(res, 404))
  )
);
