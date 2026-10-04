const AppError = require('../utils/AppError');
const { upsertRating } = require('../queries/ratingQueries');
const { listStoresWithUserRating } = require('../queries/storeQueries');

const getStores = async (userId, filters) => {
  return listStoresWithUserRating(userId, filters);
};

const submitRating = async (userId, storeId, rating) => {
  // Verify store exists
  const { query } = require('../config/db');
  const storeResult = await query('SELECT id FROM stores WHERE id = $1', [storeId]);
  if (storeResult.rows.length === 0) {
    throw new AppError('Store not found', 404);
  }

  return upsertRating(userId, storeId, rating);
};

module.exports = { getStores, submitRating };
