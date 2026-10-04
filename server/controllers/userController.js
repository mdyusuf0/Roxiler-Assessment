const userService = require('../services/userService');
const { sendResponse } = require('../middleware/errorHandler');

const getStores = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, page, limit } = req.query;
    const result = await userService.getStores(req.user.id, {
      search,
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

const submitRating = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const { rating } = req.body;
    const result = await userService.submitRating(req.user.id, storeId, rating);
    return sendResponse(res, 200, { rating: result }, 'Rating submitted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getStores, submitRating };
