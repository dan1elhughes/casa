const assert = require("assert");

const { format } = require("date-fns");

const { SUNSET_LAT, SUNSET_LNG } = process.env;
assert(SUNSET_LAT);
assert(SUNSET_LNG);

const getUrl = (date = "") =>
  `https://api.sunrise-sunset.org/json?lat=${SUNSET_LAT}&lng=${SUNSET_LNG}&formatted=0&date=${date}`;

const cache = new Map();

const getDateString = () => {
  const now = new Date();
  return format(now, "yyyy-MM-dd");
};

module.exports = async (req, res) => {
  const { got, logger } = req;

  const dateString = getDateString();

  if (cache.get(dateString) == null) {
    logger.info(`Populating cache for ${dateString}`);
    const { results } = await got(getUrl(dateString)).json();
    cache.set(dateString, results);
  }

  return cache.get(dateString);
};
