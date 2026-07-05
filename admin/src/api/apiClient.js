// Mais_Saudavel_FrontEnd/admin/src/api/apiClient.js
import axios from 'axios';

const defaultBackendUrl = 'https://maissaudavelbackend-production.up.railway.app';
const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? defaultBackendUrl : '');

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
