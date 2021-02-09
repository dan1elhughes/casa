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

  stop() {
    return this.status(0);
  }

  finish() {
    return this.status(0);
  }

  fail() {
    return this.status(1);
  }

  status(exitCode) {
    const { got, url, name } = this;
    return got.put(url + "/" + exitCode, {
      json: { name },
    });
  }
};
