/* ============================================================
   ROUTER INDEX
   ------------------------------------------------------------
   Mounts every group of routes under /api. Adding a feature
   means adding one file and one line here.
   ============================================================ */

const { Router } = require("express");

const homeRoutes = require("./homeRoutes");
const lightsRoutes = require("./lightsRoutes");
const climateRoutes = require("./climateRoutes");
const securityRoutes = require("./securityRoutes");
const sceneRoutes = require("./sceneRoutes");

const router = Router();

router.use("/", homeRoutes);              // /api/state, /api/events, /api/reset
router.use("/lights", lightsRoutes);      // /api/lights/:id
router.use("/climate", climateRoutes);    // /api/climate
router.use("/security", securityRoutes);  // /api/security
router.use("/scenes", sceneRoutes);       // /api/scenes, /api/scenes/:name

module.exports = router;
