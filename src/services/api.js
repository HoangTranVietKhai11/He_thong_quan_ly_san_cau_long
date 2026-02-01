import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { storage } from '../utils/helpers';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// Request interceptor - attach token
api.interceptors.request.use(
    (config) => {
        const token = storage.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear auth and redirect to login
                    storage.remove('token');
                    storage.remove('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access denied');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Network error
            console.error('Network error - no response received');
            return Promise.reject({ message: 'Không thể kết nối đến máy chủ' });
        } else {
            // Other errors
            console.error('Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;
