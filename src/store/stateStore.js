/* ============================================================
   STATE STORE
   ------------------------------------------------------------
   The only module that touches the disk. Everything else asks
   the store for the state and tells it to save.

   Swapping the JSON file for a real database would mean
   rewriting this file only; services and routes stay untouched.
   ============================================================ */

const fs = require("fs");
const path = require("path");

const { DATA_FILE } = require("../config");
const { defaultState } = require("./defaultState");

let state = load();

/* Read the saved state, or fall back to the defaults. */
function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return defaultState();
  }
}

/* Write the current state to disk. */
function save() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.error("Could not save state:", e.message);
  }
}

function getState() {
  return state;
}

/* Replace the whole state (used by reset) and persist it. */
function replaceState(next) {
  state = next;
  save();
  return state;
}

module.exports = { getState, replaceState, save };
