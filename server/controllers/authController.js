const authService = require('../services/authService');
const { sendResponse } = require('../middleware/errorHandler');

const signup = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendResponse(res, 201, { user, accessToken }, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, { user, accessToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    return sendResponse(res, 200, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    return sendResponse(res, 200, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, changePassword, logout };
