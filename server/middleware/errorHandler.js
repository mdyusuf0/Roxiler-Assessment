const env = require('../config/env');

// Consistent API response shape
const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = { success: statusCode < 400 };
  if (message) response.message = message;
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// Global error handler — must be registered last in Express
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  // Log the full error in development, or if it's an unexpected bug
  if (env.nodeEnv === 'development' || !err.isOperational) {
    console.error('ERROR:', err);
  }

  return sendResponse(res, statusCode, null, message);
};

module.exports = { errorHandler, sendResponse };
