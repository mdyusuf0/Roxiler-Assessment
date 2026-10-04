const AppError = require('../utils/AppError');
const { getRatingsForStore, getStoreAverageRating } = require('../queries/ratingQueries');

/**
 * Get store owner dashboard data: average rating + list of raters.
 */
const getDashboard = async (userId) => {
  // Find the store owned by this user
  const { query } = require('../config/db');
  const storeResult = await query('SELECT id, name FROM stores WHERE owner_id = $1', [userId]);

  if (storeResult.rows.length === 0) {
    throw new AppError('No store found for this owner', 404);
  }

  const store = storeResult.rows[0];
  const averageData = await getStoreAverageRating(store.id);

  return {
    store: {
      id: store.id,
      name: store.name,
      averageRating: parseFloat(averageData.average_rating),
      totalRatings: averageData.total_ratings,
    },
  };
};

const getRaters = async (userId, filters) => {
  const { query } = require('../config/db');
  const storeResult = await query('SELECT id FROM stores WHERE owner_id = $1', [userId]);

  if (storeResult.rows.length === 0) {
    throw new AppError('No store found for this owner', 404);
  }

  return getRatingsForStore(storeResult.rows[0].id, filters);
};

module.exports = { getDashboard, getRaters };
