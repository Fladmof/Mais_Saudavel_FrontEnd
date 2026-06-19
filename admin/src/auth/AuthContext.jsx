// Mais_Saudavel_FrontEnd/admin/src/auth/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });

  async function login(email, password) {
    const resp = await apiClient.post('/auth/login', { email, password });
    const { token: tk, user: u } = resp.data.data;
    if (!u || u.role !== 'admin') {
      const err = new Error('Apenas administradores podem aceder a este painel.');
      err.code = 'NOT_ADMIN';
      throw err;
    }
    localStorage.setItem('admin_token', tk);
    localStorage.setItem('admin_user', JSON.stringify(u));
    setToken(tk);
    setUser(u);
    return u;
  }

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth tem de ser usado dentro de AuthProvider');
  return ctx;
}
