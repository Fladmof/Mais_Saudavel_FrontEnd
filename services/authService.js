// services/authService.js
import api from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
    async register(userData) {
  const response = await api.post('/auth/register', userData);
  const { token, refreshToken, user } = response.data.data;
  await AsyncStorage.multiSet([
    ['auth_token', token],
    ['refresh_token', refreshToken],
    ['user_data', JSON.stringify(user)]
  ]);
  return response.data.data;
}

async login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const { token, refreshToken, user } = response.data.data;
  await AsyncStorage.multiSet([
    ['auth_token', token],
    ['refresh_token', refreshToken],
    ['user_data', JSON.stringify(user)]
  ]);
  return response.data.data;
}

async verify() {
  const response = await api.get('/auth/me');
  return response.data.data;
}
    async logout() {
        await api.post('/auth/logout').catch(() => {});
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
    }

    async getCurrentUser() {
        const raw = await AsyncStorage.getItem('user_data');
        return raw ? JSON.parse(raw) : null;
    }
}

export default new AuthService();