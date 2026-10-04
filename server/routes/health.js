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

module.exports = router;
