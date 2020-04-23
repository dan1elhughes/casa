const { SERVICE_IFTTT_URL } = process.env;
const got = require("got");

module.exports = {
  read(device) {
    return {
      name: device.name,
      id: device.params.id,
    };
  },

  async write(device, state) {
    const { id } = device.params;
    return got
      .put(`${SERVICE_IFTTT_URL}/devices/${id}`, { json: { state } })
      .json();
  },
};
