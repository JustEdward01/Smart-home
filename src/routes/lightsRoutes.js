/* ============================================================
   ROUTES: /api/lights
   ------------------------------------------------------------
   Routes only translate HTTP into service calls. They contain
   no rules about how a light behaves.
   ============================================================ */

const { Router } = require("express");
const lightsService = require("../services/lightsService");
const homeService = require("../services/homeService");

const router = Router();

/* PATCH /api/lights/:id   body { on?, level? } */
router.patch("/:id", (req, res, next) => {
  try {
    lightsService.updateLight(req.params.id, req.body);
    res.json(homeService.publicState());
  } catch (err) {
    next(err);   // handed to the error middleware
  }
});

/* POST kept as an alias so older clients keep working. */
router.post("/:id", (req, res, next) => {
  try {
    lightsService.updateLight(req.params.id, req.body);
    res.json(homeService.publicState());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
