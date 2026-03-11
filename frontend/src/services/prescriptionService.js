import api from '../api/axios';

export const getMyPrescriptions = () => api.get('/prescriptions/my-prescriptions');
