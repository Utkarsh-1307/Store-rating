import api from './axiosInstance';

export const submitRating = (data) => api.post('/ratings', data);
export const updateRating = (id, data) => api.put(`/ratings/${id}`, data);
export const deleteRating = (id) => api.delete(`/ratings/${id}`);
