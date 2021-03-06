const Healthcheck = require("@casa/lib-healthcheck");

const {
  parse,
  subMinutes,
  isAfter,
  differenceInSeconds,
  endOfToday,
} = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");
const TIMEZONE = "Europe/London";

const TIME_MATCH_TOLERANCE_SECONDS = 90;

const schedule = require("../config/schedule.json");

const shouldTriggerSunset = async (req) => {
  const { logger, getServiceURL, got } = req;

  const sunsetURL = getServiceURL("service.sunset");
  const { sunset } = await got(`${sunsetURL}/sunset`).json();

  const triggerAt = new Date(sunset);
  const now = new Date();
  const difference = Math.abs(differenceInSeconds(now, triggerAt));

  logger.debug(
    `Sunset: trigger ${triggerAt}, now ${now}, difference: ${difference}`
  );

  return difference <= TIME_MATCH_TOLERANCE_SECONDS;
};

const shouldTriggerDateTime = async ({ logger }, triggerDateTime) => {
  const now = new Date();

  const difference = Math.abs(differenceInSeconds(now, triggerDateTime));

  logger.debug(
    `Time: trigger ${triggerDateTime}, now ${now}, difference: ${difference}`
  );

  return difference <= TIME_MATCH_TOLERANCE_SECONDS;
};

const shouldTriggerTime = async (req, triggerTime) => {
  const rawTrigger = parse(triggerTime, "HH:mm", new Date());
  const triggerAt = zonedTimeToUtc(rawTrigger, TIMEZONE);

  return shouldTriggerDateTime(req, triggerAt);
};

module.exports = async (req, res) => {
  const { logger, got } = req;

  const check = new Healthcheck(req, "scheduler_tick", "* * * * *");
  await check.start();

  const triggered = [];
  for (const { scene, at } of schedule) {
    switch (at) {
      case "@sunset":
        if (await shouldTriggerSunset(req)) {
          triggered.push(scene);
        }
        break;
      case "00:00":
        if (await shouldTriggerDateTime(req, endOfToday())) {
          triggered.push(scene);
        }
        break;
      default:
        if (await shouldTriggerTime(req, at)) {
          triggered.push(scene);
        }
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
