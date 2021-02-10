const devices = require("../config/devices.json");
const controllers = require("../controllers");

const { send, json } = require("micro");

module.exports = async (req, res) => {
  const { got, logger, getServiceURL } = req;

  const redisService = getServiceURL("service.redis");

  const { id, isLocked } = req.params;
  if (isLocked === "true") {
    logger.debug(`Locked device: ${id}`);
    return got.put(`${redisService}/hash/set/locks/${id}`, {
      json: true,
    });
  }

  logger.debug(`Unlocked device: ${id}`);
  return got.delete(`${redisService}/hash/delete/locks/${id}`);
};
