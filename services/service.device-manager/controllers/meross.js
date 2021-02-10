module.exports = {
  async read(req, device) {
    const { got, getServiceURL } = req;
    const { id, channel } = device.params;

    const channelParameter = channel ? `/${channel}` : "";
    const merossService = getServiceURL("service.meross");

    return got(`${merossService}/devices/${id}${channelParameter}`).json();
  },

  async write(req, device, state) {
    const { got, getServiceURL } = req;
    const { id, channel } = device.params;

    const channelParameter = channel ? `/${channel}` : "";
    const merossService = getServiceURL("service.meross");

    return got
      .put(`${merossService}/devices/${id}${channelParameter}`, {
        json: { state },
      })
      .json();
  },
};
