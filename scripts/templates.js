const folders = ["models", "views", "routes", "logs", "json"];

const helpFiles = ["help-init.txt", "help-config.txt", "help-token.txt"];

const configjson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the app.",
  main: "app.js",
  superuser: "adm1n",
  database: "exampledb",
};

const tokenjson = [
  {
    created: "1969-01-31 12:30:00",
    username: "username",
    email: "user@example.com",
    phone: "5556597890",
    token: "token",
    expires: "1969-02-03 12:30:00",
    confirmed: "tbd",
  },
];

const initHelp = `app init <option>

Usage:

app init --status                     displays status of all directories and files created during init 
app init --all                        creates the folder structure and the config and help files
app init --mk                         creates the folder structure
app init --cat                        creates the config file with default settings and the help files`;

const configHelp = `app config <option>

Usage:

app config --show                     displays a list of the current config settings
app config --reset                    rests the config file with default settings
app config --set <option> <value>     sets a specific config settings
app config --add <attribute>          adds a new attribute to the config settings`;

const tokenHelp = `app token <option>

Usage:

app token --count                       displays a count of the tokens created                      
app token --check <username>            displays whether or not the specified token has expired                      
app token --new <username>              generates a token for a given username, saves, tokens to the json file
app token --add <username> <attribute>  adds a new attribute to the config settings
app token --upd p <username> <phone>    updates the json entry with a new phone number and refreshes expiry if expired
app token --upd e <username> <email>    updates the json entry with the new email and refreshes expiry if expired
app token --search u <username>         fetches a token for a given username                         
app token --search e <email>            fetches a token for a given email
app token --search p <phone>            fetches a token for a given phone number`;

module.exports = {
  folders,
  helpFiles,
  configjson,
  tokenjson,
  initHelp,
  configHelp,
  tokenHelp,
};
