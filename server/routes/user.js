const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { submitRatingSchema } = require('../validators/schemas');

const router = express.Router();

// All user routes require authentication + user role
router.use(authenticate, authorize('user'));

router.get('/stores', userController.getStores);
router.put('/stores/:storeId/rating', validate(submitRatingSchema), userController.submitRating);

module.exports = router;
