import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const adminService = {
    // Lấy thống kê dashboard
    getDashboardStats: async () => {
        return api.get(API_ENDPOINTS.ADMIN_DASHBOARD);
    },

    // Lấy danh sách users
    getAllUsers: async (params = {}) => {
        return api.get(API_ENDPOINTS.ADMIN_USERS, { params });
    },

    // Cập nhật user
    updateUser: async (id, data) => {
        return api.put(API_ENDPOINTS.ADMIN_USER_DETAIL(id), data);
    },

    // Xóa user
    deleteUser: async (id) => {
        return api.delete(API_ENDPOINTS.ADMIN_USER_DETAIL(id));
    }
};

export default adminService;
