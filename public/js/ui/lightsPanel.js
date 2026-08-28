/* ============================================================
   LIGHTS PANEL
   ------------------------------------------------------------
   Builds one row per room the first time it renders, then only
   updates the values. Rebuilding the rows on every change would
   interrupt a slider the user is dragging.

   The slider sends nothing while dragging ("input") and one
   request on release ("change"), so moving it doesn't flood the
   server with requests.
   ============================================================ */

import { byId, setText, toggleClass } from "../utils/dom.js";
import { brightnessLabel } from "../utils/format.js";
import { setLightOn, setLightLevel } from "../state/actions.js";

const BULB_ICON = `
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6"/><path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>
  </svg>`;

let built = false;
const rows = {};          // room id -> row element

/* --- one row --- */
function createRow(id, light, index) {
  const row = document.createElement("div");
  row.className = "device animate-in";
  row.style.setProperty("--i", index);
  row.dataset.id = id;

  row.innerHTML = `
    <div class="device-row">
      <div class="device-id">
        <span class="bulb">${BULB_ICON}</span>
        <div>
          <div class="device-name">${light.name}</div>
          <div class="device-sub"></div>
        </div>
      </div>
      <button class="toggle" aria-label="Toggle ${light.name}"><span class="knob"></span></button>
    </div>
    <input type="range" class="brightness" min="0" max="100" aria-label="${light.name} brightness">
  `;

  const toggle = row.querySelector(".toggle");
  const slider = row.querySelector(".brightness");

  // switching on/off: send the opposite of what the server last reported
  toggle.addEventListener("click", () => {
    const pressed = toggle.getAttribute("aria-pressed") === "true";
    setLightOn(id, !pressed, row);
  });

  // dragging: local feedback only, so the slider stays smooth
  slider.addEventListener("input", () => {
    const value = Number(slider.value);
    slider.style.setProperty("--fill", `${value}%`);
    setText(row.querySelector(".device-sub"), `${value}% brightness`);
    toggleClass(row, "is-on", value > 0);
  });

  // released: commit the final value
  slider.addEventListener("change", () => {
    setLightLevel(id, Number(slider.value), row);
  });

  return row;
}

function build(lights) {
  const list = byId("lightList");
  list.innerHTML = "";
  Object.entries(lights).forEach(([id, light], index) => {
    const row = createRow(id, light, index);
    rows[id] = row;
    list.appendChild(row);
  });
  built = true;
}

/* --- values only --- */
function update(lights) {
  for (const [id, light] of Object.entries(lights)) {
    const row = rows[id];
    if (!row) continue;

    toggleClass(row, "is-on", light.on);
    row.querySelector(".toggle").setAttribute("aria-pressed", light.on);
    setText(row.querySelector(".device-sub"), brightnessLabel(light));

    const slider = row.querySelector(".brightness");
    slider.value = light.level;
    slider.style.setProperty("--fill", `${light.level}%`);
  }
}

export function render(state) {
  const home = state.home;
  if (!home) return;

  if (!built) build(home.lights);
  update(home.lights);

  const onCount = Object.values(home.lights).filter((l) => l.on).length;
  const total = Object.keys(home.lights).length;
  setText("lightsNote", `${onCount} of ${total} active`);
}
