/* ============================================================
   ENTRY POINT
   ------------------------------------------------------------
   This file does one thing: start the HTTP server.
   Building the application is the job of src/app.js, so the
   app can also be imported by tests without opening a port.
   ============================================================ */

const { createApp } = require("./src/app");
const { PORT } = require("./src/config");

const app = createApp();

app.listen(PORT, () => {
  console.log(`\n  Smart Home running at  http://localhost:${PORT}\n`);
});
