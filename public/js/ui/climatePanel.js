/* ============================================================
   CLIMATE PANEL
   ------------------------------------------------------------
   Thermostat and mode buttons. The step buttons read the target
   from the store rather than a local counter, so the value can
   never drift away from what the server holds.

   The range is enforced on the server too; the check here only
   avoids sending a request that would be rejected.
   ============================================================ */

import { byId, $$, setText } from "../utils/dom.js";
import { getState } from "../state/store.js";
import { setTemperature, setClimateMode } from "../state/actions.js";

const TEMP_MIN = 15;
const TEMP_MAX = 30;

function step(delta, button) {
  const home = getState().home;
  if (!home) return;

  const next = home.climate.target + delta;
  if (next < TEMP_MIN || next > TEMP_MAX) return;   // already at the limit

  setTemperature(next, button);
}

export function init() {
  byId("tempUp").addEventListener("click", (e) => step(+1, e.currentTarget));
  byId("tempDown").addEventListener("click", (e) => step(-1, e.currentTarget));

  $$(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => setClimateMode(button.dataset.mode, button));
  });
}

export function render(state) {
  const climate = state.home?.climate;
  if (!climate) return;

  byId("tempVal").innerHTML = `${climate.target}<span>°C</span>`;
  setText("climateNote", `now ${climate.current.toFixed(1)}°`);
  setText("humidity", `${climate.humidity}%`);

  $$(".mode-btn").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.mode === climate.mode);
  });
}
