/* ============================================================
   DEFAULT STATE
   ------------------------------------------------------------
   The shape of the whole home, in one place. Used on the first
   run (when no saved file exists) and by the reset endpoint.
   Returned by a function so every caller gets a fresh copy
   instead of sharing one mutable object.
   ============================================================ */

function defaultState() {
  return {
    lights: {
      living:  { name: "Living Room", on: true,  level: 80 },
      kitchen: { name: "Kitchen",     on: true,  level: 60 },
      bedroom: { name: "Bedroom",     on: false, level: 45 },
      hallway: { name: "Hallway",     on: false, level: 30 },
    },
    climate: {
      target: 22,        // temperature the user asked for
      mode: "heating",   // "heating" | "cooling"
      current: 21.4,     // temperature measured in the house
      humidity: 45,
    },
    security: {
      door: "locked",    // "locked" | "unlocked"
      alarm: "armed",    // "armed"  | "disarmed"
      camera: true,
    },
    scene: "home",       // "home" | "away" | "night" | "movie"
    energy: {
      // sample data for the 7-day chart (kWh/day); last item = today
      history7d: [9.8, 11.2, 8.4, 12.9, 10.1, 14.3, 12.4],
    },
  };
}

module.exports = { defaultState };
