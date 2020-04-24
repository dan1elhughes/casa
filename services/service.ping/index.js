const os = require("os");

module.exports = async (req, res) => ({
  ping: "pong",
  hostname: os.hostname(),
});
