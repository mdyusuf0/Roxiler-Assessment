const express = require('express');
const { sendResponse } = require('../middleware/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
  return sendResponse(res, 200, {
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get('/init-db', async (req, res, next) => {
  try {
    const autoInitDb = require('../config/initDb');
    const force = req.query.force === 'true';
    const result = await autoInitDb(force);
    return sendResponse(res, 200, result, 'Database initialized successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
