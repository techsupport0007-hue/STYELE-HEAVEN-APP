function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong on our end. Please try again.' : err.message;
  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
