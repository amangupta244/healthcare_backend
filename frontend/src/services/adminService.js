import api from '../api/axios';

export const getDashboardStats = () => api.get('/admin/dashboard');
