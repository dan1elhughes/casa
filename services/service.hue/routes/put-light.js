const getApi = require("../api");

const { json } = require("micro");

module.exports = async (req, res) => {
  const api = await getApi();
  const body = await json(req);
  const { id } = req.params;

  await api.lights.setLightState(id, body.state);

  return api.lights.getLightAttributesAndState(id);
};
