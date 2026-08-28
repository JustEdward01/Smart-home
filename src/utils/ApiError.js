/* ============================================================
   ApiError
   ------------------------------------------------------------
   An error that carries an HTTP status code. Services throw it,
   the error-handling middleware turns it into a JSON response.
   This is what keeps services free of req/res objects.
   ============================================================ */

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }
}

module.exports = { ApiError };
