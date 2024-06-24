// import common core module(s)
const fs = require("fs");

// import functions exported from modules
const { initApp } = require("./scripts/init");
const { configApp } = require("./scripts/config");
const { tokenApp } = require("./scripts/token");

// load in the inital global helpfile
const help = fs.readFileSync("./help/help-app.txt").toString();

// set up variable to store passed in commandline arguments
const args = process.argv.slice(2);

// CLI switch statement handling different options
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
