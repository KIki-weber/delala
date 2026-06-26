import { useState, useEffect } from 'react';
import api from '../Services/api';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const normalizeUser = (user) => {
        if (!user) return null;
        const role = user.role || user.Role;
        return {
            ...user,
            role,
            Role: role,
        };
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    if (mounted) setUser(normalizeUser(response.data.data));
                } catch (error) {
                    console.error(error);
                    localStorage.removeItem('token');
                    if (mounted) setUser(null);
                }
            }
            if (mounted) setLoading(false);
        })();

        return () => { mounted = false; };
    }, []);

    const login = async (phone, password) => {
        try {
            const response = await api.post('/auth/login', { phone, password });
            const { token, data } = response.data;
            localStorage.setItem('token', token);
            const normalized = normalizeUser(data);
            setUser(normalized);
            return { success: true, data: normalized };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const {  data } = response.data;
            const token = data.token;
            localStorage.setItem('token', token);
            const normalized = normalizeUser(data.user);
            setUser(normalized);
            return { success: true, data: normalized };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
