const os = require("os");
const { json } = require("micro");

async function withLogging(handler) {
  return async (req, res) => {
    const { method, url } = req;
    const response = await handler(req, res);
    console.log({ method, url, response });
    return response;
  };
}

module.exports = withLogging(async (req, res) => ({
  ping: "pong",
  hostname: os.hostname(),
}));
