export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.expose ? err.message : "Internal Server Error";
  const payload = { error: message };
  if (err.details && err.expose) {
    payload.details = err.details;
  }
  res.status(status).json(payload);
}
