const assert = require("assert");
const { HEALTHCHECK_API_KEY } = process.env;
assert(HEALTHCHECK_API_KEY);

const { json } = require("micro");

module.exports = async (req, res) => {
  const { got } = req;
  const body = await json(req);
  const { name, schedule } = body;

  const headers = { "X-Api-Key": HEALTHCHECK_API_KEY };

  // Create or find the healthcheck
  const rsp = await got
    .post("https://healthchecks.io/api/v1/checks/", {
      headers,
      json: {
        name,
        schedule,

        grace: 120,
        channels: "*",
        unique: ["name"],
      },
    })
    .json();

  // Use the healthcheck ID as our opaque token.
  // https://hc-ping.com/{id}
  const token = rsp.ping_url.split("/").pop();

  // Register than we've started the job, and return the token for
  // lib.healthcheck to call back with when the job finishes.
  await got.post(rsp.ping_url + "/start", {
    timeout: 5000,
    retry: 5,
  });

  return { token };
};
