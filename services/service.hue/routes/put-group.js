const putLight = require("./put-light");

const { json } = require("micro");

const groups = require("../groups.json");

module.exports = async (req, res) => {
  const body = await json(req);
  const { name } = req.params;
  const lights = groups[name];

  throw new Error("TODO");
};
