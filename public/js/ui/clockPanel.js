/* ============================================================
   CLOCK PANEL
   ------------------------------------------------------------
   The only panel that doesn't depend on server state: it reads
   the browser clock and refreshes itself on a timer.
   ============================================================ */

import { setText } from "../utils/dom.js";
import { clockTime, longDate, greeting } from "../utils/format.js";

const REFRESH_MS = 20_000;

function tick() {
  const now = new Date();
  setText("clock", clockTime(now));
  setText("date", longDate(now));
  setText("greeting", `${greeting(now)}, welcome home`);
}

export function init() {
  tick();
  setInterval(tick, REFRESH_MS);
}
