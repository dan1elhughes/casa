const devices = require("../config/devices.json");
const { SERVICE_REDIS_URL } = process.env;
const controllers = require("../controllers");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { got, logger } = req;

  const { id, isLocked } = req.params;
  if (isLocked === "true") {
    logger.debug(`Locked device: ${id}`);
    return got.put(`${SERVICE_REDIS_URL}/hash/set/locks/${id}`, {
      json: true,
    });
  }

  logger.debug(`Unlocked device: ${id}`);
  return got.delete(`${SERVICE_REDIS_URL}/hash/delete/locks/${id}`);
};
