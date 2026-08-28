/* ============================================================
   FORMATTING
   ------------------------------------------------------------
   Turns values into the strings shown on screen. Kept out of the
   panels so wording and number formats live in one place.
   ============================================================ */

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

/* 24-hour clock: "09:05" */
export function clockTime(date = new Date()) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* "Monday, August 26" */
export function longDate(date = new Date()) {
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

/* Greeting that follows the time of day. */
export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h >= 22 || h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* An ISO timestamp from the server, as a short clock time. */
export function eventTime(iso) {
  return clockTime(new Date(iso));
}

/* What a light's sub-label says. */
export function brightnessLabel(light) {
  return light.on ? `${light.level}% brightness` : "Off";
}
