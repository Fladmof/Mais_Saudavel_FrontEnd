// services/authService.js
import api from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
    // Login
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.token) {
                // Salvar token e dados do usuário
                await AsyncStorage.setItem('@user_token', response.data.token);
                await AsyncStorage.setItem('@user_data', JSON.stringify(response.data.user));
                
                // Configurar token padrão para próximas requisições
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Verificar se token é válido (para manter login)
    verifyToken: async () => {
        try {
            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            // Token inválido, fazer logout
            await authService.logout();
            throw error;
        }
    },

    // Logout
    logout: async () => {
        await AsyncStorage.removeItem('@user_token');
        await AsyncStorage.removeItem('@user_data');
        delete api.defaults.headers.common['Authorization'];
    },

    // Configurar token ao iniciar app
    setupToken: async () => {
        const token = await AsyncStorage.getItem('@user_token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        }
        return false;
    }
};