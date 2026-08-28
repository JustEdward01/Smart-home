/* ============================================================
   HOME SERVICE
   ------------------------------------------------------------
   Assembles the object the frontend receives: the stored state
   plus everything derived from it (energy, activity log).

   Every route answers with this, so one action always leaves the
   whole interface consistent after a single request.
   ============================================================ */

const { getState, replaceState } = require("../store/stateStore");
const { defaultState } = require("../store/defaultState");
const eventLog = require("../store/eventLog");
const energyService = require("./energyService");

function publicState() {
  const state = getState();
  return {
    lights: state.lights,
    climate: state.climate,
    security: state.security,
    scene: state.scene,
    energy: energyService.summary(),
    events: eventLog.visible(),
  };
}

/* Back to factory settings, for a clean demo. */
function reset() {
  replaceState(defaultState());
  eventLog.clear();
  eventLog.add("System reset to defaults");
  return publicState();
}

module.exports = { publicState, reset };
