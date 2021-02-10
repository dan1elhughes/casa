module.exports = class Healthcheck {
  constructor(req, name) {
    this.name = name;
    this.url = req.getServiceURL("service.healthcheck");
    this.got = req.got;
  }

  async start() {
    const { got, url, name } = this;
    return got.put(url + "/start", {
      json: { name },
    });
  }

  async stop() {
    return this.finish();
  }

  async finish() {
    const { got, url, name } = this;
    return got.put(url + "/finish", {
      json: { name },
    });
  }

  async fail() {
    const { got, url, name } = this;
    return got.put(url + "/fail", {
      json: { name },
    });
  }
};
