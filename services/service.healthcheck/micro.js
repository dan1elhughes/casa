const micro = require("micro");
const handlers = require("./index.js");
micro(handlers).listen(3000);
