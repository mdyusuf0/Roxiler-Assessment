import api from './api';

export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getAdminStores = (params) => api.get('/admin/stores', { params });
export const getAdminUserDetails = (id) => api.get(`/admin/users/${id}`);
export const createUser = (data) => api.post('/admin/users', data);
export const createStore = (data) => api.post('/admin/stores', data);
