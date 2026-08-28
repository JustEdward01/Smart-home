/* ============================================================
   SECURITY SERVICE
   ============================================================ */

const { getState, save } = require("../store/stateStore");
const eventLog = require("../store/eventLog");
const { ApiError } = require("../utils/ApiError");

const DOOR_STATES = ["locked", "unlocked"];
const ALARM_STATES = ["armed", "disarmed"];

/* Apply a change.  patch = { door?, alarm?, camera? } */
function updateSecurity(patch = {}) {
  const security = getState().security;
  const { door, alarm, camera } = patch;

  if (door !== undefined) {
    if (!DOOR_STATES.includes(door)) {
      throw ApiError.badRequest(`door must be one of: ${DOOR_STATES.join(", ")}`);
    }
    security.door = door;
  }

  if (alarm !== undefined) {
    if (!ALARM_STATES.includes(alarm)) {
      throw ApiError.badRequest(`alarm must be one of: ${ALARM_STATES.join(", ")}`);
    }
    security.alarm = alarm;
  }

  if (camera !== undefined) {
    if (typeof camera !== "boolean") throw ApiError.badRequest("camera must be true or false");
    security.camera = camera;
  }

  eventLog.add(
    `Security: door ${security.door}, alarm ${security.alarm}, ` +
    `camera ${security.camera ? "on" : "off"}`
  );
  save();
  return security;
}

/* The house counts as secured only with the door locked and the alarm armed. */
function isSecured() {
  const { door, alarm } = getState().security;
  return door === "locked" && alarm === "armed";
}

module.exports = { updateSecurity, isSecured, DOOR_STATES, ALARM_STATES };
