const { json } = require("micro");

const {
  SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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",
} = process.env;

module.exports = async (req, res) => {
  const { got } = req;
  const body = await json(req);
  await got.post(SLACK_WEBHOOK_URL, { json: body });
  return { ok: true };
};
