import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = storage.get('user');
        const token = storage.get('token');

        if (storedUser && token) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { user, token } = response;

            // Store user and token
            storage.set('user', user);
            storage.set('token', token);

            setUser(user);
            setIsAuthenticated(true);

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message || 'Đăng nhập thất bại' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const { user, token } = response;

            // Store user and token
            storage.set('user', user);
            storage.set('token', token);

            setUser(user);
            setIsAuthenticated(true);

            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message || 'Đăng ký thất bại' };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state regardless of API call result
            storage.remove('user');
            storage.remove('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedUser) => {
        storage.set('user', updatedUser);
        setUser(updatedUser);
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        hasRole,
        hasAnyRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
