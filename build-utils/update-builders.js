const fs = require("fs"),
  ini = require("ini");

const { builders } = ini.parse(
  fs.readFileSync("./infrastructure/inventory", "utf-8")
);

fs.writeFileSync(
  "./build-utils/builders/builders",
  Object.keys(builders).join("\n")
);
