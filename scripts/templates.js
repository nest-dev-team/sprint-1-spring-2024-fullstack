const folders = ["models", "views", "routes", "logs", "json"];

const helpFiles = ["help-init.txt", "help-config.txt", "help-token.txt"];

const configjson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "myapp.js",
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

const initHelp = `myapp init <option>

Usage:

myapp init --status                     displays status of all directories and files created during init 
myapp init --all                        creates the folder structure and the config and help files
myapp init --mk                         creates the folder structure
myapp init --cat                        creates the config file with default settings and the help files`;

const configHelp = `myapp config <option>

Usage:

myapp config --show                     displays a list of the current config settings
myapp config --reset                    rests the config file with default settings
myapp config --set <option> <value>     sets a specific config settings
myapp config --add <attribute>          adds a new attribute to the config settings`;

const tokenHelp = `myapp token <option>

Usage:

myapp token --count                       displays a count of the tokens created                      
myapp token --check <username>            displays whether or not the specified token has expired                      
myapp token --new <username>              generates a token for a given username, saves, tokens to the json file
myapp token --add <username> <attribute>  adds a new attribute to the config settings
myapp token --upd p <username> <phone>    updates the json entry with a new phone number and refreshes expiry if expired
myapp token --upd e <username> <email>    updates the json entry with the new email and refreshes expiry if expired
myapp token --search u <username>         fetches a token for a given username                         
myapp token --search e <email>            fetches a token for a given email
myapp token --search p <phone>            fetches a token for a given phone number`;

module.exports = {
  folders,
  helpFiles,
  configjson,
  tokenjson,
  initHelp,
  configHelp,
  tokenHelp,
};
