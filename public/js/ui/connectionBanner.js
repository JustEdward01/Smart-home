/* ============================================================
   CONNECTION BANNER
   ------------------------------------------------------------
   Watches `online` in the store and shows a warning when the
   server can't be reached.
   ============================================================ */

import { byId, toggleClass } from "../utils/dom.js";

export function render(state) {
  toggleClass(byId("offline"), "show", state.online === false);
}
