const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  signupSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validators/schemas');

const router = express.Router();

// Public routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes (any authenticated user)
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
