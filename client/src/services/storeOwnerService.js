import api from './api';

export const getOwnerDashboard = () => api.get('/store-owner/dashboard');
export const getOwnerRatings = (params) => api.get('/store-owner/ratings', { params });
