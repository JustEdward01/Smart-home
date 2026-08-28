/* ============================================================
   ROUTES: /api/scenes
   ============================================================ */

const { Router } = require("express");
const sceneService = require("../services/sceneService");
const homeService = require("../services/homeService");

const router = Router();

/* GET /api/scenes -> the scenes the API accepts */
router.get("/", (req, res) => {
  const list = Object.entries(sceneService.SCENES).map(([id, scene]) => ({
    id,
    label: scene.label,
  }));
  res.json(list);
});

/* POST /api/scenes/:name -> apply it */
router.post("/:name", (req, res, next) => {
  try {
    sceneService.applyScene(req.params.name);
    res.json(homeService.publicState());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
