module.exports = {
  async read(req, device) {
    const { got, getServiceURL } = req;
    const { id } = device.params;
    const hueService = getServiceURL("service.hue");
    return got(`${hueService}/lights/${id}`).json();
  },

  async write(req, device, state) {
    const { got, getServiceURL } = req;
    const { id } = device.params;
    const hueService = getServiceURL("service.hue");
    return got.put(`${hueService}/lights/${id}`, { json: { state } }).json();
  },
};
