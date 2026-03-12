import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('/utenti/login', credentials),
};

export const clientService = {
  getAll: () => api.get('/clienti/'),
  getById: (id) => api.get(`/clienti/${id}`),
  create: (data) => api.post('/clienti/', data),
  update: (id, data) => api.put(`/clienti/${id}`, data),
  delete: (id) => api.delete(`/clienti/${id}`),
};

export const deliveryService = {
  getAll: (params) => api.get('/consegne/', { params }),
  getById: (id) => api.get(`/consegne/${id}`),
  create: (data) => api.post('/consegne/', data),
  update: (id, data) => api.put(`/consegne/${id}`, data),
  delete: (id) => api.delete(`/consegne/${id}`),
};

export const trackingService = {
  track: (chiave, dataRitiro) => api.get(`/tracking/${chiave}/${dataRitiro}`),
};

export const userService = {
    getAll: () => api.get('/utenti/'),
    create: (data) => api.post('/utenti/', data),
    update: (id, data) => api.put(`/utenti/${id}`, data),
    delete: (id) => api.delete(`/utenti/${id}`),
};

export default api;
