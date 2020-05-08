const { SERVICE_IFTTT_URL } = process.env;

module.exports = {
  read(_, device) {
    return {
      name: device.name,
      id: device.params.id,
    };
  },

  async write(req, device, state) {
    const { got } = req;
    const { id } = device.params;
    return got
      .put(`${SERVICE_IFTTT_URL}/devices/${id}`, { json: { state } })
      .json();
  },
};
