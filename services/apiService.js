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

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');

                const response = await axios.post(
                    `${API_CONFIG.baseURL}/auth/refresh`,
                    { refreshToken }
                );

                const newToken = response.data.data.token;
                await AsyncStorage.setItem('auth_token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;