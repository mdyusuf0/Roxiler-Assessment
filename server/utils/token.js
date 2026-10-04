const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
