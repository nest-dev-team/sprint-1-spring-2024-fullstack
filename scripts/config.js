const fs = require("fs");
const path = require("path");
const { emitter } = require("./eventlog");
const { configjson } = require("./templates");

const args = process.argv.slice(2);

function displayConfig() {
  const fileName = path.join(__dirname, "..", "json", "config.json");

  try {
    if (fs.existsSync(fileName)) {
      const config = JSON.parse(fs.readFileSync(fileName));
      console.log(config);
    } else {
      console.log(
        "Config file has not been initialized. Run 'app init --all' or 'app init --cat' to create file."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function displayConfigHelp() {
  const configHelpFile = path.join(__dirname, "..", "help", "help-config.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  if (fs.existsSync(configHelpFile)) {
    const help = fs.readFileSync(configHelpFile).toString();
    console.log(help);
  } else {
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

function setConfig() {
  const filePath = path.join(__dirname, "..", "json", "config.json");
  fs.readFile(filePath, (error, data) => {
    if (error) throw error;

    let config = JSON.parse(data);
    let match = false;

    for (const key in config) {
      if (key === args[2]) {
        config[key] = args[3];
        match = true;
      }
    }

    if (match) {
      fs.writeFile(filePath, JSON.stringify(config, null, 2), (error) => {
        if (error) throw error;

        emitter.emit(
          "config",
          "config",
          "SET",
          "SUCCESS",
          `Config set successfully.`
        );

        console.log("Config updated successfull.");
      });
    } else {
      emitter.emit(
        "config",
        "config",
        "SET",
        "FAILURE",
        `Config set not successful.`
      );

      console.log(`Update failed, ${args[2]} is an invalid key.`);
    }
  });
}

function resetConfig() {
  const configJSON = JSON.stringify(configjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "config.json");

  if (fs.existsSync(fileName)) {
    fs.writeFile(fileName, configJSON, (error) => {
      if (error) throw error;

      emitter.emit(
        "config",
        "config",
        "RESET",
        "SUCCESS",
        `Config reset successfully.`
      );

      console.log("Config reset to default state.");
    });
  } else {
    emitter.emit(
      "config",
      "config",
      "RESET",
      "FAILURE",
      `Config count not be reset.`
    );

    console.log(
      "Config file does not exist. Run 'app init --all' or 'app init --cat' to initialize file."
    );
  }
}

function configApp() {
  switch (args[1]) {
    case "--show":
      displayConfig();
      break;
    case "--set":
      setConfig();
      break;
    case "--reset":
      resetConfig();
      break;
    case "--help":
    case "--h":
    default:
      displayConfigHelp();
      break;
  }
}

module.exports = {
  configApp,
};
