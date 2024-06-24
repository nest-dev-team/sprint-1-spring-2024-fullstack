const fs = require("fs");
const path = require("path");
const crc32 = require("crc/crc32");
const { format } = require("date-fns");
const { emitter } = require("./eventlog");

const args = process.argv.slice(2);

function newToken(username) {
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
  token.username = username;
  token.token = crc32(username).toString(8);

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      tokens.push(token);

      fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;

        emitter.emit(
          "token",
          "token",
          "CREATE",
          "SUCCESS",
          `New token created successfully.`
        );

        console.log(
          `Token ${token.token} for ${token.username} was created successfully.`
        );
      });
    } catch (error) {
      emitter.emit(
        "token",
        "token",
        "CREATE",
        "FAILURE",
        `New token creation failed.`
      );

      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });

  return token.token;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function updateEmail(username, email) {
  return new Promise((resolve, reject) => {
    if (!username) {
      console.log("Please provide a username.");
      resolve("Username required");
      return;
    }

    if (!email) {
      console.log("Please provide an email address.");
      resolve("Email required");
      return;
    }

    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        if (index === -1) {
          console.log(`${username} not found.`);
          resolve(`User ${username} not found.`);
          return;
        }

        tokens[index].email = email;

        fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
          if (error) throw error;

          emitter.emit(
            "token",
            "token",
            "UPDATE EMAIL",
            "SUCCESS",
            `Token email updated successfully.`
          );

          console.log(`Email for ${username} updated successfully.`);
          resolve(`Email for ${username} updated successfully.`);
        });
      } catch (error) {
        emitter.emit(
          "token",
          "token",
          "UPDATE EMAIL",
          "FAILURE",
          `Token email update failed.`
        );

        console.log(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
        resolve(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
      }
    });
  });
}

function updatePhone(username, phone) {
  return new Promise((resolve, reject) => {
    if (!username) {
      console.log("Please provide a username.");
      resolve("Username required");
      return;
    }

    if (!phone) {
      console.log("Please provide a phone number.");
      resolve("Phone number required");
      return;
    }

    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        if (index === -1) {
          console.log(`${username} not found.`);
          resolve(`User ${username} not found.`);
          return;
        }

        tokens[index].phone = phone;

        fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
          if (error) throw error;

          emitter.emit(
            "token",
            "token",
            "UPDATE PHONE",
            "SUCCESS",
            `Token phone updated successfully.`
          );

          console.log(`Phone number for ${username} updated successfully.`);
          resolve(`Phone number for ${username} updated successfully.`);
        });
      } catch (error) {
        emitter.emit(
          "token",
          "token",
          "UPDATE PHONE",
          "FAILURE",
          `Token phone update failed.`
        );

        console.log(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
        resolve(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
      }
    });
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
    updateEmail(args[3], args[4]);
  } else if (args[2] === "p") {
    updatePhone(args[3], args[4]);
  } else {
    console.log(
      "Invalid argument. Please specify email or phone to update using 'e' or 'p'."
    );
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

function searchToken() {
  if (args.length < 3) {
    console.log(
      "Please specify username, email, or phone to update using 'u', 'e', or 'p'."
    );
    return;
  }

  if (args[2] === "e") {
    searchByEmail();
  } else if (args[2] === "p") {
    searchByPhone();
  } else if (args[2] == "u") {
    searchByUsername(args[3], false);
  } else {
    console.log(
      "Invalid argument. Please specify username, email, or phone to update using 'u', 'e', or 'p'."
    );
  }
}

function searchByEmail() {
  if (args.length < 4) {
    console.log("Please provide a email address.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.email === args[3]);

      if (index === -1) {
        console.log(`No record with email address ${args[3]} found.`);
        return;
      }
      console.log(tokens[index]);
    } catch (error) {
      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });
}

function searchByPhone() {
  if (args.length < 4) {
    console.log("Please provide a phone number.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.phone === args[3]);

      if (index === -1) {
        console.log(`No record with phone number ${args[3]} found.`);
        return;
      }
      console.log(tokens[index]);
    } catch (error) {
      console.log(
        "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
      );
    }
  });
}

function searchByUsername(username, add) {
  return new Promise((resolve, reject) => {
    if (args.length < 4) {
      console.log("Please provide a username.");
      resolve("Please provide a username.");
    }

    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        if (index === -1) {
          console.log(`No record with username ${username} found.`);
          resolve(index);
          return;
        }

        if (!add) {
          console.log(tokens[index]);
        }

        resolve(index);
      } catch (error) {
        console.log(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
      }
    });
  });
}

function countTokens() {
  return new Promise((resolve, reject) => {
    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let count = tokens.length;

        if (count === 1) {
          console.log(`There is ${count} token.`);
          resolve(`There is ${count} token.`);
          return;
        } else {
          console.log(`There are ${count} tokens.`);
          resolve(`There are ${count} tokens.`);
          return;
        }
      } catch (error) {
        console.log(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
        resolve(
          "Could not find tokens.json file. Run 'app init --all' or 'app init --cat' first."
        );
      }
    });
  });
}

function addTokenAttribue() {
  const filePath = path.join(__dirname, "..", "json", "tokens.json");

  fs.readFile(filePath, async (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = await searchByUsername(args[2], true);

      if (index === -1) {
        return;
      }

      tokens[index][args[3]] = "";

      fs.writeFile(filePath, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;

        emitter.emit(
          "token",
          "token",
          "ADD",
          "SUCCESS",
          `Attribute added successfully.`
        );

        console.log("Token attribute added successfully.");
      });
    } catch (error) {
      emitter.emit(
        "token",
        "token",
        "ADD",
        "FAILURE",
        `Failed to add attribute.`
      );

      console.log("Failed to add attribute.");
    }
  });
}

function tokenApp() {
  switch (args[1]) {
    case "--new":
      if (args.length < 3) {
        console.log("Please provide a username.");
        return;
      } else {
        newToken(args[2]);
      }
      break;
    case "--update":
    case "--upd":
      updateToken();
      break;
    case "--search":
      searchToken();
      break;
    case "--count":
      countTokens();
      break;
    case "--add":
      addTokenAttribue();
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
  newToken,
  updateEmail,
  updatePhone,
  countTokens,
};
