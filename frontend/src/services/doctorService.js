import api from '../api/axios';

export const getAllDoctors = () => api.get('/doctors');

export const getDoctorById = (id) => api.get(`/doctors/${id}`);

export const createDoctor = (data) => api.post('/doctors/create', data);

export const getDoctorProfile = () => api.get('/doctors/profile');
