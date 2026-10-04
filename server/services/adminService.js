const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { findUserByEmail, createUser } = require('../queries/userQueries');
const { createStore, findStoreById } = require('../queries/storeQueries');
const { getDashboardCounts, listUsers, getUserDetails, listStoresAdmin } = require('../queries/adminQueries');

const SALT_ROUNDS = 10;

const dashboard = async () => {
  return getDashboardCounts();
};

const addUser = async ({ name, email, password, address, role }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser({ name, email, password: hashedPassword, address, role });
};

const addStore = async ({ name, email, address, ownerId }) => {
  // Check if email is taken
  const { query: dbQuery } = require('../config/db');
  const existing = await dbQuery('SELECT id FROM stores WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('Store email already registered', 409);
  }

  return createStore({ name, email, address, ownerId });
};

const getUsers = async (filters) => {
  return listUsers(filters);
};

const getStores = async (filters) => {
  return listStoresAdmin(filters);
};

const getUser = async (userId) => {
  const user = await getUserDetails(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = { dashboard, addUser, addStore, getUsers, getStores, getUser };
