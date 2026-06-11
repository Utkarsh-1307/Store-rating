import api from './axiosInstance';

export const getStores = (search) => api.get('/stores', { params: { search } });
export const getStoreById = (id) => api.get(`/stores/${id}`);
