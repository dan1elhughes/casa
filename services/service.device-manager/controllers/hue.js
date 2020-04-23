const { SERVICE_HUE_URL } = process.env;
const got = require("got");

module.exports = {
  async read(device) {
    const { id } = device.params;
    return got(`${SERVICE_HUE_URL}/lights/${id}`).json();
  },

  async write(device, state) {
    const { id } = device.params;
    return got
      .put(`${SERVICE_HUE_URL}/lights/${id}`, { json: { state } })
      .json();
  },
};
