import api from '../api/axios';

export const getMyPrescriptions = () => api.get('/prescriptions/my-prescriptions');

export const getDoctorPrescriptions = () => api.get('/prescriptions/my-doctor-prescriptions');

export const downloadPrescription = (id) =>
  api.get(`/prescriptions/${id}/download`, { responseType: 'blob' });
