import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const ownerService = {
    // Thống kê dashboard tổng quan
    getDashboardStats: async () => {
        return api.get(API_ENDPOINTS.OWNER_DASHBOARD);
    },

    // Quản lý cơ sở sân
    getAllFacilities: async () => {
        return api.get(API_ENDPOINTS.OWNER_COURTS);
    },

    createFacility: async (data) => {
        return api.post(API_ENDPOINTS.OWNER_COURTS, data);
    },

    updateFacility: async (id, data) => {
        return api.put(`${API_ENDPOINTS.OWNER_COURTS}/${id}`, data);
    },

    deleteFacility: async (id) => {
        return api.delete(`${API_ENDPOINTS.OWNER_COURTS}/${id}`);
    }
};

export default ownerService;
