const { parse, subMinutes, isAfter, differenceInSeconds } = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");
const TIMEZONE = "Europe/London";

const got = require("got");
const { SERVICE_DEVICE_MANAGER_URL } = process.env;

const TIME_MATCH_TOLERANCE_SECONDS = 90;

const scenes = require("../config/scenes.json");

// Don't wanna publish my home address, but close enough.
const home = { lat: "51.507351", lng: "-0.127758" };
const url = `https://api.sunrise-sunset.org/json?lat=${home.lat}&lng=${home.lng}&formatted=0`;

// TODO: Cache this value.
const getSunset = async () => {
  const { results } = await got(url).json();
  return new Date(results.sunset);
};

const shouldTriggerSunset = async () => {
  const sunset = await getSunset();
  return (
    Math.abs(differenceInSeconds(new Date(), sunset)) <=
    TIME_MATCH_TOLERANCE_SECONDS
  );
};

const shouldTriggerTime = async (triggerTime) => {
  // Cancel out that parse converts to UTC - I'm defining
  // the scene triggers in local time.
  const rawTrigger = parse(triggerTime, "HH:mm", new Date());
  const utc = zonedTimeToUtc(rawTrigger, TIMEZONE);

  return (
    Math.abs(differenceInSeconds(new Date(), utc)) <=
    TIME_MATCH_TOLERANCE_SECONDS
  );
};

module.exports = async (req, res) => {
  const { logger } = req;
  const triggers = Object.entries(scenes)
    .map(([scene, { triggers }]) => {
      if (!triggers || triggers.length === 0) return;
      return triggers.map((trigger) => ({ scene, trigger }));
    })
    .filter(Boolean)
    .flat();

  logger.debug(`Got triggers: ${JSON.stringify(triggers)}`);

  const triggered = [];
  for (const { scene, trigger } of triggers) {
    switch (trigger) {
      case "@sunset":
        if (await shouldTriggerSunset()) triggered.push(scene);
        break;
      default:
        if (await shouldTriggerTime(trigger)) triggered.push(scene);
        break;
    }
  }

  for (const scene of triggered) {
    logger.debug(`Triggered: ${scene}`);
    await got.put(`${SERVICE_DEVICE_MANAGER_URL}/scenes/${scene}`);
  }

  return { triggered };
};
