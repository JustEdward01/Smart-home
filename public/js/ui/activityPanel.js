/* ============================================================
   ACTIVITY PANEL
   ------------------------------------------------------------
   Shows the action log kept by the server. Text is inserted with
   textContent rather than innerHTML, so a log entry can never be
   interpreted as markup.
   ============================================================ */

import { byId } from "../utils/dom.js";
import { eventTime } from "../utils/format.js";

function createEntry(event) {
  const li = document.createElement("li");
  li.className = "event";

  const text = document.createElement("span");
  text.className = "txt";
  text.textContent = event.text;

  const when = document.createElement("span");
  when.className = "when";
  when.textContent = eventTime(event.time);

  li.append(text, when);
  return li;
}

function showMessage(message) {
  const list = byId("eventList");
  list.innerHTML = "";
  const li = document.createElement("li");
  li.className = "event-empty";
  li.textContent = message;
  list.appendChild(li);
}

export function render(state) {
  if (state.online === false && !state.home) {
    showMessage("Server is not responding.");
    return;
  }

  const events = state.home?.events;
  if (!events) return;

  if (events.length === 0) {
    showMessage("No actions yet.");
    return;
  }

  const list = byId("eventList");
  list.innerHTML = "";
  events.forEach((event) => list.appendChild(createEntry(event)));
}
