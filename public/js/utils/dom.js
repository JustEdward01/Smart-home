/* ============================================================
   DOM HELPERS
   ------------------------------------------------------------
   Small wrappers used by every panel, so the panels read as
   intent ("set this text") instead of DOM plumbing.
   ============================================================ */

/* Find one element. */
export const $ = (selector, root = document) => root.querySelector(selector);

/* Find all elements, as a real array. */
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* Element by id. */
export const byId = (id) => document.getElementById(id);

/* Write text, guarding against a missing element. */
export function setText(target, value) {
  const el = typeof target === "string" ? byId(target) : target;
  if (el) el.textContent = value;
}

/* Add or remove a class. */
export function toggleClass(el, className, active) {
  if (el) el.classList.toggle(className, active);
}

/* Mark an element as waiting for the server. Buttons also get
   disabled so a second click can't queue a duplicate request. */
export function setBusy(el, busy) {
  if (!el) return;
  el.classList.toggle("is-busy", busy);
  if (el.tagName === "BUTTON") el.disabled = busy;
}
