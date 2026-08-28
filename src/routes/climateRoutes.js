/* ============================================================
   ROUTES: /api/climate
   ============================================================ */

const { Router } = require("express");
const climateService = require("../services/climateService");
const homeService = require("../services/homeService");

const router = Router();

/* PATCH /api/climate   body { target?, mode? } */
function handler(req, res, next) {
  try {
    climateService.updateClimate(req.body);
    res.json(homeService.publicState());
  } catch (err) {
    next(err);
  }
}

router.patch("/", handler);
router.post("/", handler);   // alias

module.exports = router;
