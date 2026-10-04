const AppError = require('../utils/AppError');

/**
 * Express middleware factory that validates req.body against a Zod schema.
 * Returns 400 with detailed error messages on failure.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Replace body with parsed (and coerced) data
  req.body = result.data;
  next();
};

module.exports = validate;
