process.env.NODE_ENV !== "production" && require("dotenv").config();
const assert = require("assert");
assert(process.env.HUE_IP);
assert(process.env.HUE_USER);
assert(process.env.HUE_KEY);

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
createSet("default", [traceMW, loggerMW]);

const getApi = require("./api");

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getHealthz = require("./routes/get-healthz");
const getLight = require("./routes/get-light");
const getLights = require("./routes/get-lights");
const putLight = require("./routes/put-light");

module.exports = applyMiddleware(
  router(
    get("/healthz", getHealthz),
    get("/lights/:id", getLight),
    get("/lights", getLights),
    put("/lights/:id", putLight),

    get("/*", (req, res) => send(res, 404))
  )
);
