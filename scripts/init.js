// import required libriaries
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const {
  folders,
  configjson,
  tokenjson,
  initHelp,
  configHelp,
  tokenHelp,
} = require("./templates");

function createFolders() {
  let mkCount = 0;

  try {
    // check each if each folder exists
    folders.forEach((folder) => {
      let folderPath = path.join(__dirname, "..", folder);

      // create folder if doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        mkCount++;
      }
    });

    if (mkCount === 0) {
      console.log("All directories already exist.");
    } else {
      console.log(
        mkCount + " of " + folders.length + " directories were created."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function createConfig() {
  const configJSON = JSON.stringify(configjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "config.json");
  const folderPath = path.join(__dirname, "..", "json");

  try {
    if (fs.existsSync(folderPath)) {
      if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, configJSON);
        console.log("Config file created successfully.");
      } else {
        console.log("Config file already exists.");
      }
    } else {
      console.log(
        "Cannot create configuration file. Required directory does not exist. Run 'app init --mk' before running --cat again."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function createHelp() {
  const initHelpFile = path.join(__dirname, "..", "help", "help-init.txt");
  const configHelpFile = path.join(__dirname, "..", "help", "help-config.txt");
  const tokenHelpFile = path.join(__dirname, "..", "help", "help-token.txt");

  try {
    if (!fs.existsSync(initHelpFile)) {
      fs.writeFileSync(initHelpFile, initHelp);
      console.log("Init help file created successfully.");
    } else {
      console.log("Init help file already exists.");
    }

    if (!fs.existsSync(configHelpFile)) {
      fs.writeFileSync(configHelpFile, configHelp);
      console.log("Config help file created successfully.");
    } else {
      console.log("Config help file already exists.");
    }

    if (!fs.existsSync(tokenHelpFile)) {
      fs.writeFileSync(tokenHelpFile, tokenHelp);
      console.log("Token help file created successfully.");
    } else {
      console.log("Token help file already exists.");
    }
  } catch (error) {
    console.log(error);
  }
}

function displayInitHelp() {
  const initHelpFile = path.join(__dirname, "..", "help", "help-init.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  if (fs.existsSync(initHelpFile)) {
    const help = fs.readFileSync(initHelpFile).toString();
    console.log(help);
  } else {
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

function initApp() {
  switch (args[1]) {
    case "--all":
      createFolders();
      createConfig();
      createHelp();
      break;
    case "--mk":
      createFolders();
      break;
    case "--cat":
      createConfig();
      createHelp();
      break;
    case "--status":
      break;
    case "--help":
    case "--h":
    default:
      displayInitHelp();
      break;
  }
}

module.exports = {
  initApp,
};
