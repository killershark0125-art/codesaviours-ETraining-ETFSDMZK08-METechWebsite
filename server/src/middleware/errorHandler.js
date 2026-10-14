function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 600
      ? err.statusCode
      : 500;

  let message = err.message;
  let errors;

  if (err.name === 'ValidationError' && err.errors && !Array.isArray(err.errors)) {
    // Mongoose schema validation failed
    statusCode = 400;
    message = 'Validation failed.';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (Array.isArray(err.errors)) {
    // Our own validation middleware attaches an errors array
    errors = err.errors;
  } else if (err.name === 'CastError') {
    // Invalid MongoDB ObjectId in a URL or query
    statusCode = 400;
    message = `Invalid ${err.path}.`;
  } else if (err.code === 11000) {
    // Duplicate value on a unique field (slug, email)
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `A record with this ${field} already exists.`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token.';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large.' : err.message;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body.';
  }

  if (statusCode >= 500) {
    console.error(err);
    message = 'Internal server error.';
  }

  const body = { success: false, message };
  if (errors) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;