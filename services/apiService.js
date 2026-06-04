// services/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@user_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            await AsyncStorage.removeItem('@user_token');
            await AsyncStorage.removeItem('@user_data');
            // Redirecionar para login
            // Você pode usar um event emitter ou contexto para isso
        }
        return Promise.reject(error);
    }
);

export default api;