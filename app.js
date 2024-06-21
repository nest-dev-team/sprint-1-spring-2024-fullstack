global.DEBUG = true;

const fs = require("fs");
const { initApp } = require("./scripts/init");
const { configApp } = require("./scripts/config");
const { tokenApp } = require("./scripts/token");

const help = fs.readFileSync("./help/help-app.txt").toString();

const args = process.argv.slice(2);

switch (args[0]) {
  case "init":
    initApp();
    break;
  case "config":
    configApp();
    break;
  case "token":
    tokenApp();
    break;
  case "--help":
  case "--h":
  default:
    console.log(help);
    break;
}
