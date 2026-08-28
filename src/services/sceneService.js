/* ============================================================
   SCENE SERVICE
   ------------------------------------------------------------
   A scene is a saved configuration applied to several devices
   at once. Each scene is plain data rather than code, so adding
   one means adding an entry to SCENES and nothing else.
   ============================================================ */

const { getState, save } = require("../store/stateStore");
const eventLog = require("../store/eventLog");
const { ApiError } = require("../utils/ApiError");

/* lights: [on, level] per room. level 0 keeps the previous brightness. */
const SCENES = {
  home: {
    label: "Home",
    lights:   { living: [true, 80], kitchen: [true, 65], bedroom: [false, 0], hallway: [true, 40] },
    target:   22,
    security: { door: "unlocked", alarm: "disarmed", camera: true },
  },
  away: {
    label: "Away",
    lights:   { living: [false, 0], kitchen: [false, 0], bedroom: [false, 0], hallway: [false, 0] },
    target:   18,
    security: { door: "locked", alarm: "armed", camera: true },
  },
  night: {
    label: "Night",
    lights:   { living: [false, 0], kitchen: [false, 0], bedroom: [false, 0], hallway: [true, 15] },
    target:   20,
    security: { door: "locked", alarm: "armed", camera: true },
  },
  movie: {
    label: "Movie",
    lights:   { living: [true, 18], kitchen: [false, 0], bedroom: [false, 0], hallway: [true, 10] },
    target:   22,
    security: { door: "locked", alarm: "disarmed", camera: true },
  },
};

function applyScene(name) {
  const scene = SCENES[name];
  if (!scene) throw ApiError.notFound(`Unknown scene: ${name}`);

  const state = getState();

  for (const [id, [on, level]] of Object.entries(scene.lights)) {
    if (!state.lights[id]) continue;
    state.lights[id].on = on;
    if (level > 0) state.lights[id].level = level;
  }

  state.climate.target = scene.target;
  state.security = { ...scene.security };
  state.scene = name;

  eventLog.add(`Scene activated: ${scene.label}`);
  save();
  return state.scene;
}

/* Names the API accepts, handy for docs and tests. */
function sceneNames() {
  return Object.keys(SCENES);
}

module.exports = { applyScene, sceneNames, SCENES };
