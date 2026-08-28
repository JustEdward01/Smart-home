/* ============================================================
   REQUEST LOGGER
   ------------------------------------------------------------
   Prints one line per API call, with how long it took. Useful
   when demonstrating that the button in the browser really does
   reach the server.
   ============================================================ */

function requestLogger(req, res, next) {
  if (!req.path.startsWith("/api")) return next();   // skip static files

  const started = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - started;
    console.log(`  ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });

  next();
}

module.exports = { requestLogger };
