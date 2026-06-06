import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../../services/authService';
import api from '../../services/apiService';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  setUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const loadFromServer = useCallback(async () => {
  setLoading(true);
  try {
    const me = await authService.verify();
    if (me?.user) {
      setUser(me.user);
      return;
    }
    const stored = await authService.getCurrentUser();
    setUser(stored);
  } catch (err) {
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);

  // Carrega estado do usuário ao montar o provider
  useEffect(() => {
    loadFromServer();
  }, [loadFromServer]);

const login = async (email, password) => {
  setLoading(true);
  try {
    const resp = await authService.login(email, password);
    const u = resp.user;
    if (u) setUser(u);
    return { success: true, user: u, data: resp };
  } catch (err) {
    setUser(null);
    return { success: false, error: err };
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      // Tenta refresh via endpoint; adapta se o refresh exigir body
      await api.post('/auth/refresh', { refreshToken: null }).catch(() => {});
      await loadFromServer();
    } catch (err) {
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};