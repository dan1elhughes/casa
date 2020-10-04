const { SERVICE_MEROSS_URL } = process.env;

module.exports = {
  async read(req, device) {
    const { got } = req;
    const { id, channel } = device.params;

    const channelParameter = channel ? `/${channel}` : "";

    return got(`${SERVICE_MEROSS_URL}/devices/${id}${channelParameter}`).json();
  },

  async write(req, device, state) {
    const { got } = req;
    const { id, channel } = device.params;

    const channelParameter = channel ? `/${channel}` : "";

    return got
      .put(`${SERVICE_MEROSS_URL}/devices/${id}${channelParameter}`, {
        json: { state },
      })
      .json();
  },
};
