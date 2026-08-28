/* ============================================================
   HOME API
   ------------------------------------------------------------
   One function per backend endpoint. This is the only place that
   knows what the URLs look like, so a change to a route means a
   change here and nowhere else.

   Every call returns the full home state, which is what lets the
   interface stay consistent after any single action.
   ============================================================ */

import { get, post, patch } from "./httpClient.js";

const BASE = "/api";

export const fetchState = () => get(`${BASE}/state`);

export const updateLight = (id, changes) => patch(`${BASE}/lights/${id}`, changes);

export const updateClimate = (changes) => patch(`${BASE}/climate`, changes);

export const updateSecurity = (changes) => patch(`${BASE}/security`, changes);

export const applyScene = (name) => post(`${BASE}/scenes/${name}`);

export const resetHome = () => post(`${BASE}/reset`);
