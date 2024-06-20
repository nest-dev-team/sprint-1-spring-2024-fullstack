const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const {configjson} = require("./templates");

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
  const filePath = path.join(__dirname, "..", "json", "config.json")
  fs.readFile(filePath, (error, data) => {
    if (error) throw error;

    let config = JSON.parse(data);
    let match = false

    for (const key in config) {
      if (key === args[2]) {
        config[key] = args[3];
        match = true;
      }
    }

    if (match) {
      fs.writeFile(filePath, JSON.stringify(config, null, 2), (error) => {
        if (error) throw error;
        console.log("Config updated successfull.");
      })
    } else {
      console.log(`Update failed, ${args[2]} is an invalid key.`);
    }
  })
}

function resetConfig() {
  const configJSON = JSON.stringify(configjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "config.json");
  const folderPath = path.join(__dirname, "..", "json");

  if (fs.existsSync(fileName)) {
    fs.writeFile(fileName, configJSON, (error) => {
      if (error) throw error;
      console.log("Config reset to default state.")
    })
  } else {
    console.log("Config file does not exist. Run 'app init --all' or 'app init --cat' to initialize file.")
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
