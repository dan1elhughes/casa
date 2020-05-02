const { json } = require("micro");

const got = require("got");
const { SLACK_WEBHOOK_URL } = process.env;

module.exports = async (req, res) => {
  const body = await json(req);
  await got.post(SLACK_WEBHOOK_URL, { json: body });
  return { ok: true };
};
