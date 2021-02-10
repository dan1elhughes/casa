const Healthcheck = require("@casa/lib-healthcheck");

const { parse, subMinutes, isAfter, differenceInSeconds } = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");
const TIMEZONE = "Europe/London";

const TIME_MATCH_TOLERANCE_SECONDS = 90;

const schedule = require("../config/schedule.json");

// Don't wanna publish my home address, but close enough.
const home = { lat: "51.507351", lng: "-0.127758" };
const url = `https://api.sunrise-sunset.org/json?lat=${home.lat}&lng=${home.lng}&formatted=0`;

// TODO: Cache this value.
const getSunset = async (req) => {
  const { got } = req;
  const { results } = await got(url).json();
  return new Date(results.sunset);
};

const shouldTriggerSunset = async (req) => {
  const { logger } = req;
  const triggerAt = await getSunset(req);
  const now = new Date();
  const difference = Math.abs(differenceInSeconds(now, triggerAt));

  logger.debug(
    `Sunset: trigger ${triggerAt}, now ${now}, difference: ${difference}`
  );

  return difference <= TIME_MATCH_TOLERANCE_SECONDS;
};

const shouldTriggerTime = async ({ logger }, triggerTime) => {
  const rawTrigger = parse(triggerTime, "HH:mm", new Date());
  const triggerAt = zonedTimeToUtc(rawTrigger, TIMEZONE);
  const now = new Date();

  const difference = Math.abs(differenceInSeconds(now, triggerAt));

  logger.debug(
    `Time: trigger ${triggerAt}, now ${now}, difference: ${difference}`
  );

  return difference <= TIME_MATCH_TOLERANCE_SECONDS;
};

module.exports = async (req, res) => {
  const { logger, got } = req;

  const check = new Healthcheck(req, "scheduler_tick", "* * * * *");
  await check.start();

  const triggered = [];
  for (const { scene, at } of schedule) {
    switch (at) {
      case "@sunset":
        if (await shouldTriggerSunset(req)) triggered.push(scene);
        break;
      default:
        if (await shouldTriggerTime(req, at)) triggered.push(scene);
        break;
    }
  }

  const deviceManagerURL = req.getServiceURL("service.device-manager");

  for (const scene of triggered) {
    logger.debug(`Triggered: ${scene}`);
    await got.put(`${deviceManagerURL}/scenes/${scene}`);
  }

  await check.finish();

  return { triggered };
};
