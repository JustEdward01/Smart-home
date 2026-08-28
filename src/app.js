/* ============================================================
   APPLICATION
   ------------------------------------------------------------
   Assembles the Express app: middleware, static files, API
   routes, error handling. Exported without being started, so
   server.js owns the port and tests can import the app.

   Order matters: parsing and logging come first, the API next,
   and the two error handlers last.
   ============================================================ */

const express = require("express");

const { PUBLIC_DIR } = require("./config");
const apiRoutes = require("./routes");
const { requestLogger } = require("./middleware/requestLogger");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  // 1. read JSON request bodies
  app.use(express.json());

  // 2. log API calls
  app.use(requestLogger);

  // 3. serve the frontend
  app.use(express.static(PUBLIC_DIR));

  // 4. the API
  app.use("/api", apiRoutes);

  // 5. unknown API paths
  app.use("/api", notFound);

  // 6. turn errors into JSON
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
