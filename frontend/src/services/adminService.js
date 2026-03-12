import api from '../api/axios';

export const getDashboardStats = () => api.get('/admin/dashboard');

export const getPatients = () => api.get('/patients');

export const getPatientById = (id) => api.get(`/patients/${id}`);

export const getPatientAppointments = (id) => api.get(`/patients/${id}/appointments`);

export const getPatientPrescriptions = (id) => api.get(`/prescriptions/patient/${id}`);
