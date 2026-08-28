/* ============================================================
   SCENE PICKER
   ------------------------------------------------------------
   The four scene buttons. Marks the active one with
   aria-pressed, which is both the accessibility state and the
   hook the stylesheet uses for the highlight.
   ============================================================ */

import { $$ } from "../utils/dom.js";
import { applyScene } from "../state/actions.js";

export function init() {
  $$(".scene").forEach((button) => {
    button.addEventListener("click", () => {
      applyScene(button.dataset.scene, button);
    });
  });
}

export function render(state) {
  if (!state.home) return;
  $$(".scene").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.scene === state.home.scene);
  });
}
