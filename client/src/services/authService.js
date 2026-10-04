import api from './api';

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const signupUser = (data) => api.post('/auth/signup', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const logoutUser = () => api.post('/auth/logout');
