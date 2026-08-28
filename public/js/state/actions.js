/* ============================================================
   ACTIONS
   ------------------------------------------------------------
   Everything the user can do, as one function each.

   Each action follows the same three steps: mark the element as
   busy, call the API, put the result in the store. Errors flip
   `online` to false instead of throwing, so a dropped connection
   shows a banner rather than breaking the page.

   The UI layer calls these; it never calls the API directly.
   ============================================================ */

import * as api from "../api/homeApi.js";
import { update } from "./store.js";
import { setBusy } from "../utils/dom.js";

/* Run an API call and fold the result into the store.
   `busyEl` is optional: the control that should show a spinner. */
async function run(apiCall, busyEl) {
  setBusy(busyEl, true);
  try {
    const home = await apiCall();
    update({ home, online: true });
  } catch (error) {
    console.error("Action failed:", error.message);
    update({ online: false });
  } finally {
    setBusy(busyEl, false);
  }
}

/* --- loading --- */
export const loadHome = () => run(api.fetchState);

/* --- lights --- */
export const setLightOn = (id, on, el) => run(() => api.updateLight(id, { on }), el);
export const setLightLevel = (id, level, el) => run(() => api.updateLight(id, { level }), el);

/* --- climate --- */
export const setTemperature = (target, el) => run(() => api.updateClimate({ target }), el);
export const setClimateMode = (mode, el) => run(() => api.updateClimate({ mode }), el);

/* --- security --- */
export const setDoor = (door, el) => run(() => api.updateSecurity({ door }), el);
export const setAlarm = (alarm, el) => run(() => api.updateSecurity({ alarm }), el);
export const setCamera = (camera, el) => run(() => api.updateSecurity({ camera }), el);

/* --- scenes --- */
export const applyScene = (name, el) => run(() => api.applyScene(name), el);

/* --- demo helper --- */
export const resetHome = (el) => run(api.resetHome, el);
