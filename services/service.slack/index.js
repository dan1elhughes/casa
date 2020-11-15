const assert = require("assert");
process.env.NODE_ENV !== "production" && require("dotenv").config();
// assert(process.env.SLACK_WEBHOOK_URL);

const { createSet, applyMiddleware } = require("micro-mw");
const traceMW = require("@casa/lib-trace")(process.env);
const loggerMW = require("@casa/lib-logger")(process.env);
createSet("default", [traceMW, loggerMW]);

const { makeRouter } = require("@casa/lib-requests");
const { routes } = require("./requests");

module.exports = applyMiddleware(makeRouter(routes));
