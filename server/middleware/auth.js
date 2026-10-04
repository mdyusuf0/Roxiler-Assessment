const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/token');

/**
 * Middleware: extracts and verifies the JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid token', 401);
  }
};

/**
 * Middleware factory: restricts access to specific roles.
 * Usage: authorize('admin', 'store_owner')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (!roles.includes(req.user.role)) {
    throw new AppError('You do not have permission to perform this action', 403);
  }

  next();
};

module.exports = { authenticate, authorize };
