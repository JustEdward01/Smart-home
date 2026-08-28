/* ============================================================
   AMBIENT GLOW
   ------------------------------------------------------------
   Drives the --glow variable behind the page from the lights
   that are on: the room dims when the house does. Written as its
   own module because it belongs to no single panel.
   ============================================================ */

const OFF = 0.05;      // nothing on: a barely visible base
const BASE = 0.15;     // something on: minimum visible glow
const RANGE = 0.5;     // added at full brightness

export function render(state) {
  const lights = state.home?.lights;
  if (!lights) return;

  const on = Object.values(lights).filter((l) => l.on);
  const average = on.length
    ? on.reduce((sum, l) => sum + l.level, 0) / on.length
    : 0;

  const strength = on.length === 0 ? OFF : BASE + RANGE * (average / 100);
  document.body.style.setProperty("--glow", strength.toFixed(2));
}
