const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { configjson } = require("./templates");
const crc32 = require("crc/crc32");
const { format, add } = require("date-fns");

const args = process.argv.slice(2);

function newToken() {
  if (args.length < 3) {
    console.log("Please provide a username.");
    return;
  }

  let token = {
    created: "",
    username: "",
    email: "",
    phone: "",
    token: "",
    expires: "",
    confirmed: "tbd",
  };

  let created = new Date();
  let expires = addDays(created, 3);

  token.created = format(created, "yyyy-MM-dd HH:mm:ss");
  token.expires = format(expires, "yyyy-MM-dd HH:mm:ss");
  token.username = args[2];
  token.token = crc32(args[2]).toString(8);

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      tokens.push(token);

      fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;
        console.log(
          `Token ${token.token} for ${token.username} was created successfully.`
        );
      });
    } catch (error) {
      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function updateEmail() {
  if (args.length < 5) {
    console.log("Please provide an email address.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");
  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.username === args[3]);

      if (index === -1) {
        console.log(`${args[3]} not found.`);
        return;
      }

      tokens[index].email = args[4];

      fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;
        console.log(`Email for ${args[3]} updated successfully.`);
      });
    } catch (error) {
      console.log(error);
      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });
}

function updatePhone() {
  if (args.length < 5) {
    console.log("Please provide a phone number.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");
  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.username === args[3]);

      if (index === -1) {
        console.log(`${args[3]} not found.`);
        return;
      }

      tokens[index].phone = args[4];

      fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;
        console.log(`Phone number for ${args[3]} updated successfully.`);
      });
    } catch (error) {
      console.log(error);
      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });
}

function updateToken() {
  if (args.length < 3) {
    console.log("Please specify email or phone to update using 'e' or 'p'.");
    return;
  }

  if (args.length < 4) {
    console.log("Please provide a username.");
    return;
  }

  if (args[2] === "e") {
    updateEmail();
  } else if (args[2] === "p") {
    updatePhone();
  }
}

function displayTokenHelp() {
  const tokenHelpFile = path.join(__dirname, "..", "help", "help-token.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  if (fs.existsSync(tokenHelpFile)) {
    const help = fs.readFileSync(tokenHelpFile).toString();
    console.log(help);
  } else {
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

function tokenApp() {
  switch (args[1]) {
    case "--new":
      newToken();
      break;
    case "--update":
    case "--upd":
      updateToken();
      break;
    case "--help":
    case "--h":
    default:
      displayTokenHelp();
      break;
  }
}

module.exports = {
  tokenApp,
};
