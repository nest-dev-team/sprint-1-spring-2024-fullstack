// import common core module(s)
const fs = require("fs");
const path = require("path");
const crc32 = require("crc/crc32");

// import functions exported from modules
const { format } = require("date-fns");
const { emitter } = require("./eventlog");

// set up variable to store passed in commandline arguments
const args = process.argv.slice(2);

// new token function
function newToken(username) {
  // create token object
  let token = {
    created: "",
    username: "",
    email: "",
    phone: "",
    token: "",
    expires: "",
    confirmed: "tbd",
  };

  // set up created and expiry dates
  let created = new Date();
  let expires = addDays(created, 3);

  // set up token object
  token.created = format(created, "yyyy-MM-dd HH:mm:ss");
  token.expires = format(expires, "yyyy-MM-dd HH:mm:ss");
  token.username = username;
  token.token = crc32(username).toString(8);

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  // read tokens.json file

  return new Promise((resolve, reject) => {
    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        // parse tokens.json file
        let tokens = JSON.parse(data);
        tokens.push(token);

        // write to tokens.json file
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

          resolve(token.token);
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
        resolve(null);
      }
    });
  });
}

// add days function
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// update email function
function updateEmail(username, email) {
  return new Promise((resolve, reject) => {
    // check if username is provided
    if (!username) {
      console.log("Please provide a username.");
      resolve("Username required");
      return;
    }

    // check if email is provided
    if (!email) {
      console.log("Please provide an email address.");
      resolve("Email required");
      return;
    }

    // set up path to tokens.json file
    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    // read tokens.json file
    fs.readFile(tokensjson, async (error, data) => {
      try {
        if (error) throw error;

        // parse tokens.json file
        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        // check if username exists
        if (index === -1) {
          console.log(`${username} not found.`);
          resolve(`User ${username} not found.`);
          return;
        }

        let expired = await checkExpired(username, false);

        // if token is expired, refresh expiry
        if (expired === 1) {
          const today = new Date();
          const expires = addDays(today, 3);
          tokens[index].expires = format(expires, "yyyy-MM-dd HH:mm:ss");
        }

        // update email
        tokens[index].email = email;

        // write to tokens.json file
        fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
          if (error) throw error;

          // emit successful update event
          emitter.emit(
            "token",
            "token",
            "UPDATE EMAIL",
            "SUCCESS",
            `Token email updated successfully.`
          );

          // if token was expired, refresh expiry
          if (expired === 1) {
            emitter.emit(
              "token",
              "token",
              "REFRESH",
              "SUCCESS",
              `Token expiry was refreshed.`
            );

            console.log(`Email for ${username} updated successfully.`);
            console.log(
              `Token was expired. Token expiry for ${username} was refreshed.`
            );
            resolve(
              `Email for ${username} updated successfully. Token was expired. Token expiry for ${username} was refreshed.`
            );
          } else {
            console.log(`Email for ${username} updated successfully.`);
            resolve(`Email for ${username} updated successfully.`);
          }
        });
        // if error occurs
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

// update phone function
function updatePhone(username, phone) {
  return new Promise((resolve, reject) => {
    // check if username is provided
    if (!username) {
      console.log("Please provide a username.");
      resolve("Username required");
      return;
    }

    // check if phone is provided
    if (!phone) {
      console.log("Please provide a phone number.");
      resolve("Phone number required");
      return;
    }

    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    // read tokens.json file
    fs.readFile(tokensjson, async (error, data) => {
      try {
        if (error) throw error;

        // parse tokens.json file
        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        // check if username exists
        if (index === -1) {
          console.log(`${username} not found.`);
          resolve(`User ${username} not found.`);
          return;
        }

        let expired = await checkExpired(username, false);

        // if token is expired, refresh expiry
        if (expired === 1) {
          const today = new Date();
          const expires = addDays(today, 3);
          tokens[index].expires = format(expires, "yyyy-MM-dd HH:mm:ss");
        }
        tokens[index].phone = phone;

        // write to tokens.json file
        fs.writeFile(tokensjson, JSON.stringify(tokens, null, 2), (error) => {
          if (error) throw error;

          // emit successful update event
          emitter.emit(
            "token",
            "token",
            "UPDATE PHONE",
            "SUCCESS",
            `Token phone updated successfully.`
          );

          // if token was expired, refresh expiry
          if (expired === 1) {
            emitter.emit(
              "token",
              "token",
              "REFRESH",
              "SUCCESS",
              `Token expiry was refreshed.`
            );

            console.log(`Phone number for ${username} updated successfully.`);
            console.log(
              `Token was expired. Token expiry for ${username} was refreshed.`
            );
            resolve(
              `Email for ${username} updated successfully. Token was expired. Token expiry for ${username} was refreshed.`
            );
          } else {
            console.log(`Phone number for ${username} updated successfully.`);
            resolve(`Phone number for ${username} updated successfully.`);
          }
        });
        // if error occurs
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

// update token function
function updateToken() {
  // check if email or phone is provided
  if (args.length < 3) {
    console.log("Please specify email or phone to update using 'e' or 'p'.");
    return;
  }

  // check if username is provided
  if (args.length < 4) {
    console.log("Please provide a username.");
    return;
  }

  // check if email or phone is provided
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

// display token help function
function displayTokenHelp() {
  const tokenHelpFile = path.join(__dirname, "..", "help", "help-token.txt");
  const appHelpFile = path.join(__dirname, "..", "help", "help-app.txt");

  // check if token help file exists
  if (fs.existsSync(tokenHelpFile)) {
    const help = fs.readFileSync(tokenHelpFile).toString();
    console.log(help);
  } else {
    const help = fs.readFileSync(appHelpFile).toString();
    console.log(help);
  }
}

// search token function
function searchToken() {
  // check if username, email, or phone is provided
  if (args.length < 3) {
    console.log(
      "Please specify username, email, or phone to update using 'u', 'e', or 'p'."
    );
    return;
  }

  // check if argument is valid
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

// search by email function
function searchByEmail() {
  // check if email is provided
  if (args.length < 4) {
    console.log("Please provide a email address.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  // read tokens.json file
  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.email === args[3]);

      // check if email exists
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

// search by phone function
function searchByPhone() {
  // check if phone is provided
  if (args.length < 4) {
    console.log("Please provide a phone number.");
    return;
  }

  const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

  // read tokens.json file
  fs.readFile(tokensjson, (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = tokens.findIndex((token) => token.phone === args[3]);

      // check if phone exists
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

// search by username function
function searchByUsername(username, add) {
  return new Promise((resolve, reject) => {
    // check if username is provided
    if (!username) {
      console.log("Please provide a username.");
      resolve("Please provide a username.");
    }

    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    // read tokens.json file
    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let index = tokens.findIndex((token) => token.username === username);

        // check if username exists
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

// count tokens function
function countTokens() {
  return new Promise((resolve, reject) => {
    const tokensjson = path.join(__dirname, "..", "json", "tokens.json");

    // read tokens.json file
    fs.readFile(tokensjson, (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let count = tokens.length;

        // check if there is only one token
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

// add token attribute function
function addTokenAttribue() {
  const filePath = path.join(__dirname, "..", "json", "tokens.json");

  // check if username and attribute is provided
  fs.readFile(filePath, async (error, data) => {
    try {
      if (error) throw error;

      let tokens = JSON.parse(data);
      let index = await searchByUsername(args[2], true);

      // check if username exists
      if (index === -1) {
        return;
      }

      // add new attribute to token
      tokens[index][args[3]] = "";

      // write to tokens.json file
      fs.writeFile(filePath, JSON.stringify(tokens, null, 2), (error) => {
        if (error) throw error;

        // emit successful add attribute event
        emitter.emit(
          "token",
          "token",
          "ADD",
          "SUCCESS",
          `Attribute added successfully.`
        );

        console.log("Token attribute added successfully.");
      });
      // if an error occurs
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

// check if token is expired function
function checkExpired(username, check) {
  return new Promise((resolve) => {
    const filePath = path.join(__dirname, "..", "json", "tokens.json");

    // check if username is provided
    fs.readFile(filePath, async (error, data) => {
      try {
        if (error) throw error;

        let tokens = JSON.parse(data);
        let index = await searchByUsername(username, true);

        // check if username exists
        if (index === -1) {
          resolve(-1);
        }

        const today = new Date();
        const expiry = new Date(tokens[index].expires);

        // check if token is expired
        if (expiry < today) {
          if (check) console.log("Token is expired.");

          emitter.emit(
            "token",
            "token",
            "CHECK",
            "EXPIRED",
            `Token is expired`
          );

          resolve(1);
        } else {
          if (check) console.log("Token is still valid.");

          // emit successful check event
          emitter.emit("token", "token", "CHECK", "VALID", `Token is valid`);

          resolve(0);
        }
      } catch {
        console.log("Failed to check expiration.");

        emitter.emit(
          "token",
          "token",
          "CHECK",
          "FAILURE",
          `Issue during check`
        );

        resolve("Failed to check expiration.");
      }
    });
  });
}

// CLI function and switch statement handling different token options
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
    case "--check":
      if (args.length < 3) {
        console.log("Please provide a username.");
      } else {
        checkExpired(args[2], true);
      }
      break;
    case "--help":
    case "--h":
    default:
      displayTokenHelp();
      break;
  }
}

// export required functions
module.exports = {
  tokenApp,
  newToken,
  updateEmail,
  updatePhone,
  countTokens,
};
