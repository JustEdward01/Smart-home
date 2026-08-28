/* ============================================================
   ENERGY SERVICE
   ------------------------------------------------------------
   Derives power draw from the current state. Nothing here is
   stored: energy is always computed, so it can never disagree
   with the devices that are actually on.
   ============================================================ */

const { getState } = require("../store/stateStore");

/* Consumption of each part of the house, in kW. */
const DRAW = {
  standby: 0.20,      // always-on devices
  bulbBase: 0.012,    // a bulb that is on, at 0% brightness
  bulbMax: 0.05,      // extra draw at 100% brightness
  heating: 1.1,
  cooling: 0.9,
  camera: 0.05,
};

/* Total power drawn right now (kW). */
function livePower() {
  const state = getState();
  let kw = DRAW.standby;

  for (const light of Object.values(state.lights)) {
    if (light.on) kw += DRAW.bulbBase + (light.level / 100) * DRAW.bulbMax;
  }

  // heating or cooling only runs while the target is not reached
  const gap = Math.abs(state.climate.target - state.climate.current);
  if (gap > 0.3) {
    kw += state.climate.mode === "heating" ? DRAW.heating : DRAW.cooling;
  }

  if (state.security.camera) kw += DRAW.camera;

  return kw;
}

/* The energy section sent to the frontend. */
function summary() {
  const history = getState().energy.history7d;
  return {
    now: +livePower().toFixed(2),
    today: history[history.length - 1],
    history7d: history,
  };
}

module.exports = { livePower, summary };
