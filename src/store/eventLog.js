/* ============================================================
   EVENT LOG
   ------------------------------------------------------------
   An in-memory list of the most recent actions, newest first.
   Kept separate from the home state because it is history, not
   configuration, and it is not persisted between restarts.
   ============================================================ */

const { EVENT_LOG_SIZE, EVENT_LOG_VISIBLE } = require("../config");

let events = [];

function add(text) {
  events.unshift({ text, time: new Date().toISOString() });
  events = events.slice(0, EVENT_LOG_SIZE);
}

/* Everything the log holds. */
function all() {
  return events;
}

/* Only the part the frontend displays. */
function visible() {
  return events.slice(0, EVENT_LOG_VISIBLE);
}

function clear() {
  events = [];
}

module.exports = { add, all, visible, clear };
