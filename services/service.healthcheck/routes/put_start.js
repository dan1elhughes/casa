const { json } = require("micro");

const { getHealthcheckURL } = require("./helpers");

module.exports = async (req, res) => {
  const { got } = req;
  const body = await json(req);
  const { name } = body;

  const url = getHealthcheckURL(name) + "/start";

  await got.post(url, {
    timeout: 1000,
    retry: 5,
  });

  return { ok: true };
};
