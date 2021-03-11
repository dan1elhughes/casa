const assert = require("assert");
const { HEALTHCHECK_API_KEY } = process.env;
assert(HEALTHCHECK_API_KEY);

const { json } = require("micro");

module.exports = async (req, res) => {
  const { got } = req;
  const body = await json(req);
  const { name, schedule } = body;

  const headers = { "X-Api-Key": HEALTHCHECK_API_KEY };

  let token = "";
  let ping_url = "";

  try {
    // Create or find the healthcheck
    const rsp = await got
      .post("https://healthchecks.io/api/v1/checks/", {
        headers,
        json: {
          name,
          schedule,

          grace: 300,
          channels: "*",
          unique: ["name"],
        },
      })
      .json();

    // Use the healthcheck ID as our opaque token.
    // https://hc-ping.com/{id}
    token = rsp.ping_url.split("/").pop();
    ping_url = rsp.ping_url;
  } catch (e) {
    console.error(e);
    return { token: "_" };
  }

  // Register than we've started the job, and return the token for
  // lib.healthcheck to call back with when the job finishes.
  // Not awaiting here, as we just fire and forget.
  got.post(ping_url + "/start", {
    timeout: 5000,
    retry: 5,
  });

  return { token };
};
