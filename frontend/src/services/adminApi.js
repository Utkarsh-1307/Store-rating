import api from './axiosInstance';

export const getDashboard = () => api.get('/admin/dashboard');
export const getUsers = (search, role) => api.get('/users', { params: { search, role } });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const getStores = (search) => api.get('/stores', { params: { search } });
export const getStoreById = (id) => api.get(`/stores/${id}`);
export const createStore = (data) => api.post('/stores', data);
