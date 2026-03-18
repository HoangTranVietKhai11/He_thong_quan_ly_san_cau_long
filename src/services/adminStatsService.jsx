import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const adminStatsService = {
  // Lấy tỷ lệ lấp đầy
  getOccupancyRate: async (facilityId = '') => {
    return api.get(`${API_ENDPOINTS.ADMIN_STATS_OCCUPANCY}?facilityId=${facilityId}`);
  },

  // Lấy xu hướng booking và thanh toán
  getTrends: async () => {
    return api.get(API_ENDPOINTS.ADMIN_STATS_TRENDS);
  }
};

export default adminStatsService;
