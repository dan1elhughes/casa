const { SERVICE_HUE_URL } = process.env;

module.exports = {
  async read(req, device) {
    const { got } = req;
    const { id } = device.params;
    return got(`${SERVICE_HUE_URL}/lights/${id}`).json();
  },

  async write(req, device, state) {
    const { got } = req;
    const { id } = device.params;
    return got
      .put(`${SERVICE_HUE_URL}/lights/${id}`, { json: { state } })
      .json();
  },
};
