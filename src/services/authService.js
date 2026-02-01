import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { storage } from '../utils/helpers';

// Mock mode - set to false when backend is ready
const MOCK_MODE = true;

// Mock authentication responses
const mockLogin = (credentials) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock validation
            if (credentials.email && credentials.password) {
                const user = {
                    id: 1,
                    name: 'Nguyễn Văn A',
                    email: credentials.email,
                    role: credentials.role || 'user', // user, owner, admin
                    avatar: null
                };
                const token = 'mock_token_' + Date.now();
                resolve({ user, token });
            } else {
                reject({ message: 'Email hoặc mật khẩu không đúng' });
            }
        }, 1000);
    });
};

const mockRegister = (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                role: userData.role || 'user',
                avatar: null
            };
            const token = 'mock_token_' + Date.now();
            resolve({ user, token });
        }, 1000);
    });
};

// Auth service
const authService = {
    // Login
    login: async (credentials) => {
        if (MOCK_MODE) {
            return mockLogin(credentials);
        }
        return api.post(API_ENDPOINTS.LOGIN, credentials);
    },

    // Register
    register: async (userData) => {
        if (MOCK_MODE) {
            return mockRegister(userData);
        }
        return api.post(API_ENDPOINTS.REGISTER, userData);
    },

    // Logout
    logout: async () => {
        if (MOCK_MODE) {
            storage.remove('token');
            storage.remove('user');
            return Promise.resolve();
        }
        return api.post(API_ENDPOINTS.LOGOUT);
    },

    // Forgot password
    forgotPassword: async (email) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ message: 'Email khôi phục mật khẩu đã được gửi' });
                }, 1000);
            });
        }
        return api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    // Reset password
    resetPassword: async (token, password) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ message: 'Mật khẩu đã được đặt lại thành công' });
                }, 1000);
            });
        }
        return api.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
    },

    // Get current user
    getCurrentUser: () => {
        return storage.get('user');
    },

    // Get token
    getToken: () => {
        return storage.get('token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!storage.get('token');
    }
};

export default authService;
