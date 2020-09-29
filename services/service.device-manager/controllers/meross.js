const { SERVICE_MEROSS_URL } = process.env;

module.exports = {
  async read(req, device) {
    const { got } = req;
    const { id } = device.params;

    return got(`${SERVICE_MEROSS_URL}/devices/${id}`).json();
  },

  async write(req, device, state) {
    const { got } = req;
    const { id } = device.params;
    return got
      .put(`${SERVICE_MEROSS_URL}/devices/${id}`, { json: { state } })
      .json();
  },
};
