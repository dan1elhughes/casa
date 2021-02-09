const { createSet, applyMiddleware } = require("micro-mw");

const commonMiddlewares = [
  require("@casa/lib-logger"),
  require("@casa/lib-service-lookup"),
  require("@casa/lib-trace"),
];

const errorMiddlewares = [require("@casa/lib-error-tracking")];

const withEnv = (env) => (fn) => fn(env);

module.exports = (env) => {
  createSet("default", commonMiddlewares.map(withEnv(env)));
  createSet("errorHandler", errorMiddlewares.map(withEnv(env)));

  return applyMiddleware;
};
