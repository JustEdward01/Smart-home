/* ============================================================
   ROUTES: /api/security
   ============================================================ */

const { Router } = require("express");
const securityService = require("../services/securityService");
const homeService = require("../services/homeService");

const router = Router();

/* PATCH /api/security   body { door?, alarm?, camera? } */
function handler(req, res, next) {
  try {
    securityService.updateSecurity(req.body);
    res.json(homeService.publicState());
  } catch (err) {
    next(err);
  }
}

router.patch("/", handler);
router.post("/", handler);   // alias

module.exports = router;
