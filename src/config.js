/* Application configuration, gathered in one place. */

const path = require("path");

module.exports = {
  PORT: process.env.PORT || 3000,

  // where the home state is persisted
  DATA_FILE: path.join(__dirname, "..", "data", "state.json"),

  // folder served to the browser
  PUBLIC_DIR: path.join(__dirname, "..", "public"),

  // how many actions the activity log keeps
  EVENT_LOG_SIZE: 20,

  // how many actions are sent to the frontend
  EVENT_LOG_VISIBLE: 8,

  // allowed range for the thermostat, in °C
  TEMP_MIN: 15,
  TEMP_MAX: 30,
};
