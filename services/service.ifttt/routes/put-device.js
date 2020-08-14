const { IFTTT_KEY } = process.env;

const { json } = require("micro");

const getUrl = (event) =>
  `https://maker.ifttt.com/trigger/${event}/with/key/${IFTTT_KEY}`;

module.exports = async (req, res) => {
  const { got } = req;
  const { device } = req.params;
  const body = await json(req);
  const { state } = body;
  const { on } = state;

  const event = encodeURIComponent(`${device}.${on}`);
  const url = getUrl(event);

  await got.post(url);

  return { state: { on } };
};
