const storeOwnerService = require('../services/storeOwnerService');
const { sendResponse } = require('../middleware/errorHandler');

const getDashboard = async (req, res, next) => {
  try {
    const data = await storeOwnerService.getDashboard(req.user.id);
    return sendResponse(res, 200, data);
  } catch (err) {
    next(err);
  }
};

const getRaters = async (req, res, next) => {
  try {
    const { sortBy, sortOrder, page, limit } = req.query;
    const result = await storeOwnerService.getRaters(req.user.id, {
      sortBy,
      sortOrder,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    return sendResponse(res, 200, result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, getRaters };
