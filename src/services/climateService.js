/* ============================================================
   CLIMATE SERVICE
   ============================================================ */

const { getState, save } = require("../store/stateStore");
const eventLog = require("../store/eventLog");
const { clamp } = require("../utils/clamp");
const { ApiError } = require("../utils/ApiError");
const { TEMP_MIN, TEMP_MAX } = require("../config");

const MODES = ["heating", "cooling"];

/* Apply a change to the climate.  patch = { target?, mode? } */
function updateClimate(patch = {}) {
  const climate = getState().climate;
  const { target, mode } = patch;

  if (target !== undefined) {
    if (typeof target !== "number" || Number.isNaN(target)) {
      throw ApiError.badRequest("target must be a number");
    }
    climate.target = clamp(Math.round(target), TEMP_MIN, TEMP_MAX);
  }

  if (mode !== undefined) {
    if (!MODES.includes(mode)) {
      throw ApiError.badRequest(`mode must be one of: ${MODES.join(", ")}`);
    }
    climate.mode = mode;
  }

  eventLog.add(`Climate: ${climate.target}°C, ${climate.mode}`);
  save();
  return climate;
}

module.exports = { updateClimate, MODES };
