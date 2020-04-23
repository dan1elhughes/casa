const v3 = require("node-hue-api").v3;

let instance;

module.exports = async function getInstanceSingleton() {
  if (instance) return instance;

  instance = await v3.api
    .createLocal(process.env.HUE_IP)
    .connect(process.env.HUE_USER);

  return instance;
};
