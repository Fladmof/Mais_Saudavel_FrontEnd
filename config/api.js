// config/api.js
const API_BASE_URL = 'http://172.20.10.13:3000' || 'http://10.0.2.2:3000'; // IMPORTANTE: Use IP da sua máquina, não localhost

// Para Expo Go, use o IP da sua rede local
// Exemplo: 'http://192.168.1.100:3000'

export default {
  baseURL: API_BASE_URL,
  endpoints: {
    registerUser: '/user/register',
    registerMedico: '/medicos/register',
    registerUtente: '/utente/register',
    login: '/auth/login',
    medicos: '/medicos',
    utentes: '/utente',
  }
};