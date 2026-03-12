import api from '../api/axios';

export const getMyAppointments = () => api.get('/appointments/my-appointments');

export const bookAppointment = (data) => api.post('/appointments/book', data);

export const getDoctorAppointments = (doctorId) => api.get(`/appointments/doctor/${doctorId}`);

export const createFollowUp = (data) => api.post('/appointments/follow-up', data);
