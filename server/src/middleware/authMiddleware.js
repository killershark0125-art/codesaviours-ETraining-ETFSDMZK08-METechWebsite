const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpError = require('../utils/httpError');

// Requires a valid "Authorization: Bearer <token>" header.
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw httpError(401, 'Authentication required.');
  }

  // Throws JsonWebTokenError / TokenExpiredError, which the error
  // handler turns into a 401.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw httpError(401, 'Invalid or expired token.');
  }

  req.user = user;
  next();
};

// Use after protect on admin-only routes.
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw httpError(403, 'Admin access required.');
  }

  next();
};

module.exports = { protect, adminOnly };