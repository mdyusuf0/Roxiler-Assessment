const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const {
  findUserByEmail,
  createUser,
  getUserPasswordById,
  updateUserPassword,
} = require('../queries/userQueries');

const SALT_ROUNDS = 10;

/**
 * Sign up a new normal user.
 */
const signup = async ({ name, email, password, address }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email, password: hashedPassword, address, role: 'user' });

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return { user, accessToken, refreshToken };
};

/**
 * Log in any user (admin, user, store_owner).
 */
const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Don't return password hash
  const { password: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

/**
 * Change password for the currently authenticated user.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const storedHash = await getUserPasswordById(userId);
  if (!storedHash) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, storedHash);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUserPassword(userId, newHash);
};

module.exports = { signup, login, changePassword };
