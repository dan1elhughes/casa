module.exports.getHealthcheckURL = (name = "") => {
  const key = `CHECK_${name}_URL`.toUpperCase();

  const value = process.env[key];
  if (value) return value;

  throw new Error(
    `Unconfigured healthcheck (missing environment variable): ${key}`
  );
};
