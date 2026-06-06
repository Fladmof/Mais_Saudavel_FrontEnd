// hooks/useAuth.js
import { useState, useCallback } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(email, password);
            setUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (err) {
            setError(err.message || 'Erro ao fazer login');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRegister = useCallback(async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.register(userData);
            setUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (err) {
            setError(err.message || 'Erro ao registrar');
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        user,
        handleLogin,
        handleRegister,
        setError
    };
};