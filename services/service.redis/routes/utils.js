const { promisify } = require("util");

module.exports.async = (client, method) =>
  promisify(client[method]).bind(client);
