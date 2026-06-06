// config/api.js
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export default {
    baseURL: API_BASE_URL,
    endpoints: {
        auth: {
            register: '/auth/register',
            login: '/auth/login',
            refresh: '/auth/refresh',
            logout: '/auth/logout',
            me: '/auth/me',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password'
        },
        utente: {
            register: '/utente/register',
            list: '/utente',
            get: '/utente/:id',
            search: '/utente/search/:nome'
        },
        medico: {
            register: '/medicos/register',
            list: '/medicos',
            get: '/medicos/:id',
            search: '/medicos/search/:nome'
        }
    }
};