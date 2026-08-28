/* ============================================================
   ROUTES: /api/state, /api/events, /api/reset
   ============================================================ */

const { Router } = require("express");
const homeService = require("../services/homeService");
const eventLog = require("../store/eventLog");

const router = Router();

/* GET /api/state -> the whole home */
router.get("/state", (req, res) => {
  res.json(homeService.publicState());
});

/* GET /api/events -> the full activity log */
router.get("/events", (req, res) => {
  res.json(eventLog.all());
});

/* POST /api/reset -> back to defaults */
router.post("/reset", (req, res) => {
  res.json(homeService.reset());
});

module.exports = router;
