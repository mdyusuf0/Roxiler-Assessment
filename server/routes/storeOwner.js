const express = require('express');
const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All store owner routes require authentication + store_owner role
router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', storeOwnerController.getDashboard);
router.get('/ratings', storeOwnerController.getRaters);

module.exports = router;
