/* ============================================================
   FRONTEND ENTRY POINT
   ------------------------------------------------------------
   Wires the application together and does nothing else:

     1. attach the panels that handle clicks
     2. subscribe every panel that draws to the store
     3. show skeletons and ask the server for the state

   From then on the flow is one direction only:

     click -> action -> API -> store -> every panel redraws

   No panel talks to another. Adding a panel means importing it
   and adding it to one of the two lists below.
   ============================================================ */

import { subscribe } from "./state/store.js";
import { loadHome } from "./state/actions.js";

import * as skeletons from "./ui/skeletons.js";
import * as connectionBanner from "./ui/connectionBanner.js";
import * as clockPanel from "./ui/clockPanel.js";
import * as summaryBar from "./ui/summaryBar.js";
import * as scenePicker from "./ui/scenePicker.js";
import * as lightsPanel from "./ui/lightsPanel.js";
import * as climatePanel from "./ui/climatePanel.js";
import * as securityPanel from "./ui/securityPanel.js";
import * as energyPanel from "./ui/energyPanel.js";
import * as activityPanel from "./ui/activityPanel.js";
import * as ambientGlow from "./ui/ambientGlow.js";

/* Panels that listen for user input, attached once at startup. */
const interactive = [
  clockPanel,
  scenePicker,
  lightsPanel,
  climatePanel,
  securityPanel,
];

/* Panels that draw themselves whenever the state changes. */
const drawable = [
  connectionBanner,
  summaryBar,
  scenePicker,
  lightsPanel,
  climatePanel,
  securityPanel,
  energyPanel,
  activityPanel,
  ambientGlow,
];

function start() {
  // 1. attach event listeners
  for (const panel of interactive) {
    if (typeof panel.init === "function") panel.init();
  }

  // 2. redraw every panel on each state change
  subscribe((state) => {
    for (const panel of drawable) {
      if (typeof panel.render === "function") panel.render(state);
    }
  });

  // 3. placeholders, then the real data
  skeletons.show();
  loadHome();
}

start();
