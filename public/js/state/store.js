/* ============================================================
   STORE
   ------------------------------------------------------------
   Holds the client state and notifies subscribers when it
   changes (the observer pattern).

   Panels never call each other: they subscribe here and each
   redraws itself. That is what keeps them independent, so a new
   panel can be added without touching the existing ones.

   Shape:
     home    - the state received from the server (null until loaded)
     online  - whether the last request reached the server
   ============================================================ */

let state = {
  home: null,
  online: true,
};

const subscribers = new Set();

export function getState() {
  return state;
}

/* Merge a change and notify everyone. */
export function update(patch) {
  state = { ...state, ...patch };
  for (const notify of subscribers) {
    notify(state);
  }
}

/* Register a listener; returns a function that removes it. */
export function subscribe(listener) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}
