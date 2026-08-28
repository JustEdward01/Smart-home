/* ============================================================
   LIGHTS SERVICE
   ============================================================ */

const { getState, save } = require("../store/stateStore");
const eventLog = require("../store/eventLog");
const { clamp } = require("../utils/clamp");
const { ApiError } = require("../utils/ApiError");

/* One light, or an error if the room doesn't exist. */
function getLight(id) {
  const light = getState().lights[id];
  if (!light) throw ApiError.notFound(`Unknown room: ${id}`);
  return light;
}

/* Apply a change to a light.  patch = { on?, level? } */
function updateLight(id, patch = {}) {
  const light = getLight(id);
  const { on, level } = patch;

  if (level !== undefined) {
    if (typeof level !== "number" || Number.isNaN(level)) {
      throw ApiError.badRequest("level must be a number");
    }
    light.level = clamp(Math.round(level), 0, 100);
    // dragging the slider up also switches the light on
    if (on === undefined && light.level > 0) light.on = true;
  }

  if (on !== undefined) {
    if (typeof on !== "boolean") throw ApiError.badRequest("on must be true or false");
    light.on = on;
  }

  eventLog.add(`Light ${light.name}: ` + (light.on ? `on ${light.level}%` : "off"));
  save();
  return light;
}

/* How many lights are on (used by the summary). */
function onCount() {
  return Object.values(getState().lights).filter((l) => l.on).length;
}

module.exports = { getLight, updateLight, onCount };
