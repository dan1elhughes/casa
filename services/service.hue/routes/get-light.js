const getApi = require("../api");

module.exports = async (req, res) => {
  const api = await getApi();
  const { id } = req.params;
  return api.lights.getLightAttributesAndState(id);
};
