const adminService = require('../services/adminService');
const { sendResponse } = require('../middleware/errorHandler');

const dashboard = async (req, res, next) => {
  try {
    const counts = await adminService.dashboard();
    return sendResponse(res, 200, counts);
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const user = await adminService.addUser(req.body);
    return sendResponse(res, 201, { user }, 'User created successfully');
  } catch (err) {
    next(err);
  }
};

const addStore = async (req, res, next) => {
  try {
    const store = await adminService.addStore(req.body);
    return sendResponse(res, 201, { store }, 'Store created successfully');
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { search, role, sortBy, sortOrder, page, limit } = req.query;
    const result = await adminService.getUsers({
      search,
      role,
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

const getStores = async (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, page, limit } = req.query;
    const result = await adminService.getStores({
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

const getUser = async (req, res, next) => {
  try {
    const user = await adminService.getUser(parseInt(req.params.id, 10));
    return sendResponse(res, 200, { user });
  } catch (err) {
    next(err);
  }
};

module.exports = { dashboard, addUser, addStore, getUsers, getStores, getUser };
