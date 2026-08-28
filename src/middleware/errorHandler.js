/* ============================================================
   ERROR HANDLER
   ------------------------------------------------------------
   The single place where an error becomes an HTTP response.
   An ApiError keeps its status; anything unexpected becomes a
   500 so an internal message is never leaked to the client.

   Express recognises this as an error handler because it takes
   four arguments.
   ============================================================ */

function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("Unexpected error:", err);
  }

  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
  });
}

module.exports = { errorHandler };
