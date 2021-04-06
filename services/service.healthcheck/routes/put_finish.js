module.exports = async (req, res) => {
  const { got } = req;
  const { token } = req.params;

  // Failed to create Healthcheck - silently ignore as it'll show up as a Slack
  // post anyway.
  if (token === "_") {
    return { ok: false };
  }

  const url = `https://hc-ping.com/${token}`;

  // Not awaiting here, as we just fire and forget.
  got.post(url, {
    timeout: 5000,
    retry: 5,
  });

  return { ok: true };
};
