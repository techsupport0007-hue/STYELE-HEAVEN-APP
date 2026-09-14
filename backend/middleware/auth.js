const jwt = require('jsonwebtoken');

function decodeToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Attaches req.user if a valid token is present; never blocks the request.
function optionalAuth(req, res, next) {
  const payload = decodeToken(req);
  if (payload) req.user = payload;
  next();
}

// Requires a valid token; responds 401 otherwise.
function requireAuth(req, res, next) {
  const payload = decodeToken(req);
  if (!payload) return res.status(401).json({ error: 'Please log in to continue.' });
  req.user = payload;
  next();
}

module.exports = { optionalAuth, requireAuth };
