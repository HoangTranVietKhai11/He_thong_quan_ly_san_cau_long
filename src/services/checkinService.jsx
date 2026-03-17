import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const checkinService = {
    // Lấy danh sách booking hôm nay
    getTodayBookings: async () => {
        return api.get(API_ENDPOINTS.CHECKIN_TODAY);
    },

    // Tìm kiếm booking để check-in
    searchBooking: async (query, type = 'booking_id') => {
        return api.get(API_ENDPOINTS.CHECKIN_SEARCH, { params: { query, type } });
    },

    // Check-in một booking
    checkIn: async (booking_id) => {
        return api.post(API_ENDPOINTS.CHECKIN_DO(booking_id));
    },

    // Gia hạn booking
    extendBooking: async (booking_id, extend_minutes) => {
        return api.put(API_ENDPOINTS.CHECKIN_EXTEND(booking_id), { extend_minutes });
    }
};

export default checkinService;
