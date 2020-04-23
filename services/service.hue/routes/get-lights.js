const getApi = require("../api");

module.exports = async (req, res) => {
  const api = await getApi();

  const lights = await api.lights.getAll();

  const lightStates = await Promise.all(
    lights.map((light) => api.lights.getLightAttributesAndState(light.id))
  );

  return lightStates;
};
