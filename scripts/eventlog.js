// import modules
const events = require("events");
const fs = require("fs");
const path = require("path");
const { format, getYear } = require("date-fns");
const { v4: uuid } = require("uuid");

// create emitter
const emitter = new events.EventEmitter();

// event listeners
emitter.addListener("init", onCLIEvent);
emitter.addListener("config", onCLIEvent);
emitter.addListener("token", onCLIEvent);

// event-log function
function onCLIEvent(event, type, status, message) {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const year = `${getYear(new Date())}`;
  const logItem = `${dateTime}\t${type}\t${status}\t${message}\t${uuid()}`;

  try {
    // check if logs/ exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      fs.mkdirSync(path.join(__dirname, "..", "logs"));
    }

    // check if logs/event/ exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs", event))) {
      fs.mkdirSync(path.join(__dirname, "..", "logs", event));
    }

    // check if current year folder exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs", event, year))) {
      fs.mkdirSync(path.join(__dirname, "..", "logs", event, year));
    }

    const fileName =
      `${format(new Date(), "yyyyMMdd")}` + `_${event}_events.log`;
    fs.appendFileSync(
      path.join(__dirname, "..", "logs", event, year, fileName),
      logItem + "\n"
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { emitter };
