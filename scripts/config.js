// import common core module(s)
const fs = require("fs");
const path = require("path");

// import functions exported from modules
const { emitter } = require("./eventlog");
const { configjson } = require("./templates");

// set up variable to store passed in commandline arguments
const args = process.argv.slice(2);

// display config function
function displayConfig() {
  // set up file path
  const fileName = path.join(__dirname, "..", "json", "config.json");

  try {
    // check if config.json exists
    if (fs.existsSync(fileName)) {
      // show if it does
      const config = JSON.parse(fs.readFileSync(fileName));
      console.log(config);
    } else {
      // display if it doesn't
      console.log(
        "Config file has not been initialized. Run 'app init --all' or 'app init --cat' to create file."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// display config help function
function displayConfigHelp() {
  // set up file paths
  const configHelpFile = path.join(__dirname, "..", "help", "help-config.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  // check if help-config.txt exists
  if (fs.existsSync(configHelpFile)) {
    // display it if it does
    const help = fs.readFileSync(configHelpFile).toString();
    console.log(help);
  } else {
    // display help-app.txt if it doesn't
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

// set config function
function setConfig() {
  try {
    // set up file paths
    const filePath = path.join(__dirname, "..", "json", "config.json");

    // read config.json file
    fs.readFile(filePath, (error, data) => {
      if (error) throw error;

      let config = JSON.parse(data);
      let match = false;

      // check if passed in key exists
      for (const key in config) {
        if (key === args[2]) {
          config[key] = args[3];
          match = true;
        }
      }

      // if key does exist
      if (match) {
        // write file back with new value
        fs.writeFile(filePath, JSON.stringify(config, null, 2), (error) => {
          if (error) throw error;

          // emit successful cofig set event
          emitter.emit(
            "config",
            "config",
            "SET",
            "SUCCESS",
            `Config set successfully.`
          );

          console.log("Config updated successfull.");
        });
        // if key does exist
      } else {
        // emit failure config set event
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
  } catch (error) {
    // emit failure config set event
    emitter.emit(
      "config",
      "config",
      "SET",
      "FAILURE",
      `Config set not successful.`
    );

    console.log(
      "Config file does not exist. Run 'app init --all' or 'app init --cat' to initialize file."
    );
  }
}

// reset config function
function resetConfig() {
  // set up file paths
  const configJSON = JSON.stringify(configjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "config.json");

  // check if config.json file exists
  if (fs.existsSync(fileName)) {
    // reset if it does
    fs.writeFile(fileName, configJSON, (error) => {
      if (error) throw error;

      // emit successful config reset event
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
    // emit failure config reset event
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

// add new attribute to config function
function addConfig() {
  try {
    // set up file paths
    const filePath = path.join(__dirname, "..", "json", "config.json");

    // read config.json
    fs.readFile(filePath, (error, data) => {
      if (error) throw error;

      // add the new attribute and set it to empty value
      let config = JSON.parse(data);
      config[args[2]] = "";

      // write file back to config.json
      fs.writeFile(filePath, JSON.stringify(config, null, 2), (error) => {
        if (error) throw error;

        // emit successful add config event
        emitter.emit(
          "config",
          "config",
          "ADD",
          "SUCCESS",
          `Attribute set successfully.`
        );

        console.log("Config attribute added successfully.");
      });
    });
    // if an error occurs
  } catch (error) {
    // emit failure add config event
    emitter.emit(
      "config",
      "config",
      "ADD",
      "FAILURE",
      `Failed to set attribute.`
    );

    console.log("Failed to add config attribute");
  }
}

// CLI function and switch statement handling different config options
function configApp() {
  switch (args[1]) {
    case "--show":
      displayConfig();
      break;
    case "--set":
      setConfig();
      break;
    case "--add":
      addConfig();
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

// export required functions
module.exports = {
  configApp,
};
