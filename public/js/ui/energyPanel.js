/* ============================================================
   ENERGY PANEL
   ------------------------------------------------------------
   Live draw and the 7-day chart. Bar heights are percentages of
   the tallest day, so the chart stays readable whatever the
   numbers are.
   ============================================================ */

import { byId, setText } from "../utils/dom.js";

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function renderChart(history) {
  const chart = byId("chart");
  const max = Math.max(...history);

  chart.innerHTML = history
    .map((value, i) => {
      const height = Math.round((value / max) * 100);
      const isToday = i === history.length - 1;
      return `
        <div class="bar-col">
          <div class="bar${isToday ? " today" : ""}" style="height:${height}%"></div>
          <div class="bar-lbl">${DAY_LABELS[i]}</div>
        </div>`;
    })
    .join("");
}

export function render(state) {
  const energy = state.home?.energy;
  if (!energy) return;

  setText("powerNow", energy.now.toFixed(1));
  setText("todayKwh", energy.today);
  renderChart(energy.history7d);
}
