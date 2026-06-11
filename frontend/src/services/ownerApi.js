import api from './axiosInstance';

export const getDashboard = () => api.get('/owner/dashboard');
export const getRatings = () => api.get('/owner/ratings');
