// import common core module(s)
const fs = require("fs");
const path = require("path");

// import functions exported from modules
const { emitter } = require("./eventlog");

// set up variable to store passed in commandline arguments
const args = process.argv.slice(2);

// import all required objects from templates module
const {
  folders,
  helpFiles,
  configjson,
  tokenjson,
  initHelp,
  configHelp,
  tokenHelp,
} = require("./templates");

// create folders/directories function
function createFolders() {
  let mkCount = 0;

  try {
    // check if each directory exists
    folders.forEach((folder) => {
      let folderPath = path.join(__dirname, "..", folder);

      // create directory if doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);

        // emit successful directory created event
        emitter.emit(
          "init",
          "init",
          "DIR",
          "SUCCESS",
          `'/${folder}' created successfully.`
        );

        // increament number of directories created
        mkCount++;
      }
    });

    // check the number of folders created and display to user
    if (mkCount === 0) {
      console.log("All directories already exist.");
    } else {
      console.log(
        mkCount + " of " + folders.length + " directories were created."
      );
    }
    // display any errors
  } catch (error) {
    console.log(error);
  }
}

// create config file function
function createConfig() {
  // read object and set up file paths
  const configJSON = JSON.stringify(configjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "config.json");
  const folderPath = path.join(__dirname, "..", "json");

  try {
    // check if json directory exists
    if (fs.existsSync(folderPath)) {
      // check if config.json exists
      if (!fs.existsSync(fileName)) {
        // write file if it doesn't
        fs.writeFileSync(fileName, configJSON);

        // emit successful file creation event
        emitter.emit(
          "init",
          "init",
          "FILE",
          "SUCCESS",
          `'config.json' created successfully.`
        );

        console.log("Config file created successfully.");
      } else {
        console.log("Config file already exists.");
      }
    } else {
      // emit failure file creation event
      emitter.emit(
        "init",
        "init",
        "FILE",
        "FAILURE",
        `'config.json' could not be created.`
      );

      console.log(
        "Cannot create configuration file. Required directory does not exist. Run 'app init --mk' before running --cat again."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// create token file function
function createToken() {
  // read object and set up file paths
  const tokenJSON = JSON.stringify(tokenjson, null, 2);
  const fileName = path.join(__dirname, "..", "json", "tokens.json");
  const folderPath = path.join(__dirname, "..", "json");

  try {
    // check if json directory exists
    if (fs.existsSync(folderPath)) {
      // check if tokens.json exists
      if (!fs.existsSync(fileName)) {
        // write file if it doesn't
        fs.writeFileSync(fileName, tokenJSON);

        // emit successful file creation event
        emitter.emit(
          "init",
          "init",
          "FILE",
          "SUCCESS",
          `'tokens.json' created successfully.`
        );

        console.log("Tokens file created successfully.");
      } else {
        console.log("Tokens file already exists.");
      }
    } else {
      // emit failure file creation event
      emitter.emit(
        "init",
        "init",
        "FILE",
        "FAILURE",
        `'tokens.json' could not be created.`
      );

      console.log(
        "Cannot create tokens file. Required directory does not exist. Run 'app init --mk' before running --cat again."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// create help files function
function createHelp() {
  // read objects and set up file paths
  const initHelpFile = path.join(__dirname, "..", "help", "help-init.txt");
  const configHelpFile = path.join(__dirname, "..", "help", "help-config.txt");
  const tokenHelpFile = path.join(__dirname, "..", "help", "help-token.txt");

  try {
    // check if help-init.txt exists
    if (!fs.existsSync(initHelpFile)) {
      // write file if it doesn't
      fs.writeFileSync(initHelpFile, initHelp);

      // emit successful file creation event
      emitter.emit(
        "init",
        "init",
        "FILE",
        "SUCCESS",
        `'help-init.txt' created successfully.`
      );

      console.log("Init help file created successfully.");
    } else {
      console.log("Init help file already exists.");
    }

    // check if help-config.txt exists
    if (!fs.existsSync(configHelpFile)) {
      // write file if it doesn't
      fs.writeFileSync(configHelpFile, configHelp);

      // emit successful file creation event
      emitter.emit(
        "init",
        "init",
        "FILE",
        "SUCCESS",
        `'help-config.txt' created successfully.`
      );

      console.log("Config help file created successfully.");
    } else {
      console.log("Config help file already exists.");
    }

    // check if help-token.txt exists
    if (!fs.existsSync(tokenHelpFile)) {
      // write file if it doesn't
      fs.writeFileSync(tokenHelpFile, tokenHelp);

      // emit successful file creation event
      emitter.emit(
        "init",
        "init",
        "FILE",
        "SUCCESS",
        `'help-token.txt' created successfully.`
      );

      console.log("Token help file created successfully.");
    } else {
      console.log("Token help file already exists.");
    }
    // display any errors
  } catch (error) {
    console.log(error);
  }
}

// display init help function
function displayInitHelp() {
  // set up file paths
  const initHelpFile = path.join(__dirname, "..", "help", "help-init.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  // check if help-init.txt exists
  if (fs.existsSync(initHelpFile)) {
    // display it if it does
    const help = fs.readFileSync(initHelpFile).toString();
    console.log(help);
  } else {
    // display help-app.txt if it doesn't
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

// get status function
function getStatus() {
  console.log("Directories:");

  // check if each directory exists or not
  folders.forEach((folder) => {
    let folderPath = path.join(__dirname, "..", folder);

    // show that it has aready been created
    if (fs.existsSync(folderPath)) {
      console.log(`✔  '${folder}' directory has already been created.`);
      // show that it has not been created
    } else {
      console.log(`❌ '${folder}' directory has not been created.`);
    }
  });

  console.log("Files");
  const config = path.join(__dirname, "..", "json", "config.json");

  // check if config.json exists or not
  if (fs.existsSync(config)) {
    console.log(`✔  'config.json' file has already been created.`);
  } else {
    console.log(`❌ 'config.json' file has not been created.`);
  }

  const token = path.join(__dirname, "..", "json", "tokens.json");

  // check if token.json exists or not
  if (fs.existsSync(token)) {
    console.log(`✔  'tokens.json' file has already been created.`);
  } else {
    console.log(`❌ 'tokens.json' file has not been created.`);
  }

  // check if help files exists or not
  helpFiles.forEach((file) => {
    let filePath = path.join(__dirname, "..", "help", file);

    if (fs.existsSync(filePath)) {
      console.log(`✔  '${file}' file has already been created.`);
    } else {
      console.log(`❌ '${file}' file has not been created.`);
    }
  });
}

// CLI function and switch statement handling different init options
function initApp() {
  switch (args[1]) {
    case "--all":
      createFolders();
      createConfig();
      createToken();
      createHelp();
      break;
    case "--mk":
      createFolders();
      break;
    case "--cat":
      createConfig();
      createToken();
      createHelp();
      break;
    case "--status":
      getStatus();
      break;
    case "--help":
    case "--h":
    default:
      displayInitHelp();
      break;
  }
}

// export required functions
module.exports = {
  initApp,
};
