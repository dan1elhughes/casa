const { SERVICE_REDIS_URL } = process.env;

module.exports.locked = async (req, id) => {
  const { got, logger } = req;

  try {
    await got(`${SERVICE_REDIS_URL}/hash/get/locks/${id}`);
    logger.debug(`Device is locked: ${id}`);
    return true;
  } catch (e) {
    if (e.response.statusCode === 404) return false;
    throw e;
  }
};