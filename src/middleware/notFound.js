/* ============================================================
   NOT FOUND
   ------------------------------------------------------------
   Catches unknown /api paths so a typo returns clean JSON
   instead of Express's default HTML page.
   ============================================================ */

const { ApiError } = require("../utils/ApiError");

function notFound(req, res, next) {
  next(ApiError.notFound(`No API route for ${req.method} ${req.originalUrl}`));
}

module.exports = { notFound };
