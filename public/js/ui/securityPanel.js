/* ============================================================
   SECURITY PANEL
   ------------------------------------------------------------
   Door, alarm and camera. The three rows behave identically, so
   they share one render helper driven by a small table instead
   of three near-copies of the same code.
   ============================================================ */

import { byId, setText, toggleClass } from "../utils/dom.js";
import { getState } from "../state/store.js";
import { setDoor, setAlarm, setCamera } from "../state/actions.js";

/* One row: which ids it uses, and the wording for each state. */
const ROWS = [
  {
    item: "doorItem", state: "doorState", button: "doorBtn",
    isSafe: (s) => s.door === "locked",
    safeText: "Locked", unsafeText: "Unlocked",
    safeAction: "Unlock", unsafeAction: "Lock",
    onClick: (s, el) => setDoor(s.door === "locked" ? "unlocked" : "locked", el),
  },
  {
    item: "alarmItem", state: "alarmState", button: "alarmBtn",
    isSafe: (s) => s.alarm === "armed",
    safeText: "Armed", unsafeText: "Disarmed",
    safeAction: "Disarm", unsafeAction: "Arm",
    onClick: (s, el) => setAlarm(s.alarm === "armed" ? "disarmed" : "armed", el),
  },
  {
    item: "camItem", state: "camState", button: "camBtn",
    isSafe: (s) => s.camera === true,
    safeText: "On", unsafeText: "Off",
    safeAction: "Turn off", unsafeAction: "Turn on",
    onClick: (s, el) => setCamera(!s.camera, el),
  },
];

export function init() {
  for (const row of ROWS) {
    byId(row.button).addEventListener("click", (e) => {
      const security = getState().home?.security;
      if (security) row.onClick(security, e.currentTarget);
    });
  }
}

export function render(state) {
  const security = state.home?.security;
  if (!security) return;

  for (const row of ROWS) {
    const safe = row.isSafe(security);

    const item = byId(row.item);
    toggleClass(item, "secure", safe);
    toggleClass(item, "open", !safe);

    setText(row.state, safe ? row.safeText : row.unsafeText);
    setText(byId(row.button).querySelector("span"), safe ? row.safeAction : row.unsafeAction);
  }
}
