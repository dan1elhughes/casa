process.env.NODE_ENV === "development" && require("dotenv").config();

const getApi = require("./api");

const { send } = require("micro");
const { router, get, put } = require("microrouter");

const getHealthz = require("./routes/get-healthz");
const getLight = require("./routes/get-light");
const getLights = require("./routes/get-lights");
const putLight = require("./routes/put-light");

module.exports = router(
  get("/healthz", getHealthz),
  get("/lights/:id", getLight),
  get("/lights", getLights),
  put("/lights/:id", putLight),

  get("/*", (req, res) => send(res, 404))
);
