/* ============================================================
   SUMMARY BAR
   ------------------------------------------------------------
   Read-only: the four pills that summarise the whole house.
   ============================================================ */

import { byId, setText } from "../utils/dom.js";

const SCENE_LABELS = { home: "Home", away: "Away", night: "Night", movie: "Movie" };

export function render(state) {
  const home = state.home;
  if (!home) return;

  // lights
  const onCount = Object.values(home.lights).filter((l) => l.on).length;
  setText("lightsCount", onCount);

  // temperature
  setText("tempPill", `${home.climate.target}°`);

  // security: the dot colour carries the state
  const secured = home.security.door === "locked" && home.security.alarm === "armed";
  const dot = byId("secDot");
  if (dot) dot.className = `dot ${secured ? "on" : "off"}`;
  setText("secPill", secured ? "Home secured" : "Check security");

  // active scene
  setText("scenePill", SCENE_LABELS[home.scene] || home.scene);
}
