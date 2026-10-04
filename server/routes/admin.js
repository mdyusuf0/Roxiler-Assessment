const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createUserSchema, createStoreSchema } = require('../validators/schemas');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.dashboard);
router.post('/users', validate(createUserSchema), adminController.addUser);
router.post('/stores', validate(createStoreSchema), adminController.addStore);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);
router.get('/users/:id', adminController.getUser);

module.exports = router;
