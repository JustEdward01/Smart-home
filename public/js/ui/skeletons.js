/* ============================================================
   SKELETONS
   ------------------------------------------------------------
   Placeholder shapes shown while the first request is in flight,
   so the page has its final layout before the data arrives
   instead of jumping when it does.
   ============================================================ */

import { byId } from "../utils/dom.js";

const LIGHT_ROWS = 4;
const CHART_HEIGHTS = [45, 65, 35, 80, 55, 90, 70];
const EVENT_ROWS = 3;

const repeat = (count, html) => Array.from({ length: count }, () => html).join("");

export function show() {
  byId("lightList").innerHTML = repeat(LIGHT_ROWS, `
    <div class="sk-row">
      <div class="skeleton sk-tile"></div>
      <div class="sk-lines">
        <div class="skeleton sk-line sk-line-1"></div>
        <div class="skeleton sk-line sk-line-2"></div>
      </div>
      <div class="skeleton sk-toggle"></div>
    </div>`);

  byId("chart").innerHTML = CHART_HEIGHTS.map((height) => `
    <div class="bar-col">
      <div class="skeleton sk-bar" style="height:${height}%"></div>
      <div class="skeleton sk-tick"></div>
    </div>`).join("");

  byId("eventList").innerHTML = repeat(EVENT_ROWS, `
    <li class="event">
      <span class="skeleton sk-ev"></span>
      <span class="skeleton sk-evt"></span>
    </li>`);
}
