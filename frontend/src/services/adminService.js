import api from '../api/axios';

export const getDashboardStats = () => api.get('/admin/dashboard');

export const getPatients = () => api.get('/patients');
