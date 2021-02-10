module.exports = class Healthcheck {
  constructor(req, name, schedule) {
    this.url = req.getServiceURL("service.healthcheck");
    this.got = req.got;

    this.name = name;
    this.schedule = schedule;
  }

  async start() {
    const { got, url, name, schedule } = this;

    const { token } = await got
      .put(url + "/start", {
        json: { name, schedule },
      })
      .json();

    this.token = token;
  }

  async stop() {
    return this.finish();
  }

  async finish() {
    const { got, url, token } = this;
    return got.put(`${url}/${token}/finish`);
  }

  async fail() {
    const { got, url, token } = this;
    return got.put(`${url}/${token}/fail`);
  }
};
