const { send } = require("micro");

const getApi = require("../api");

module.exports = async (req, res) => {
  try {
    const api = await getApi();
    await api.lights.getAll();
    return { ok: true };
  } catch (e) {
    return send(res, 500, e.message);
  }
};
