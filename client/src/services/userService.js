import api from './api';

export const getUserStores = (params) => api.get('/user/stores', { params });
export const submitRating = (storeId, rating) => api.put(`/user/stores/${storeId}/rating`, { rating });
