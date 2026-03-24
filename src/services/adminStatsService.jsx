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
  },

  // Phân phối theo giờ
  getHourlyDistribution: () => api.get('/admin/stats/hourly'),

  // Phân phối theo ngày trong tuần
  getWeeklyDistribution: () => api.get('/admin/stats/weekly'),

  // Top khách hàng
  getTopCustomers: (limit = 5) => api.get(`/admin/stats/top-customers?limit=${limit}`),

  // Phát hiện xung đột đặt sân
  getConflicts: () => api.get('/admin/stats/conflicts'),

  // Dự đoán khung giờ vàng
  getPredictedGoldenHours: (facilityId = '') => api.get(`/admin/stats/predicted-golden-hours?facilityId=${facilityId}`),
};

export default adminStatsService;
