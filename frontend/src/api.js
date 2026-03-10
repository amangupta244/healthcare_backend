import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  // Ignore invalid placeholder token values (e.g. "undefined")
  if (token && token !== 'undefined') cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
