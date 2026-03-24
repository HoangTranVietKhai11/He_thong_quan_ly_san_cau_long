import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const staffOpsService = {
    // --- Equipments / Inventory ---
    getEquipments: (facilityId = '') => {
        return api.get(`${API_ENDPOINTS.STAFF_EQUIPMENTS}?facility_id=${facilityId}`);
    },

    addEquipment: (data) => {
        return api.post(API_ENDPOINTS.STAFF_EQUIPMENTS, data);
    },

    updateEquipment: (id, data) => {
        return api.put(API_ENDPOINTS.STAFF_EQUIPMENT_DETAIL(id), data);
    },

    deleteEquipment: (id) => {
        return api.delete(API_ENDPOINTS.STAFF_EQUIPMENT_DETAIL(id));
    },

    // --- Maintenance ---
    getMaintenanceLogs: (courtId = '') => {
        return api.get(`${API_ENDPOINTS.STAFF_MAINTENANCE}?court_id=${courtId}`);
    },

    addMaintenanceLog: (data) => {
        return api.post(API_ENDPOINTS.STAFF_MAINTENANCE, data);
    },

    updateMaintenanceStatus: (id, data) => {
        return api.put(API_ENDPOINTS.STAFF_MAINTENANCE_DETAIL(id), data);
    },

    // --- Shifts ---
    startShift: (data) => {
        return api.post('/staff/ops/shifts/start', data);
    },

    endShift: (data) => {
        return api.put(`/staff/ops/shifts/end/${data.shift_id}`, data);
    },

    getMyShifts: () => {
        return api.get('/staff/ops/shifts/current');
    },

    // --- Rentals ---
    getRentalsByBooking: (bookingId) => {
        return api.get(`/staff/ops/rentals?booking_id=${bookingId}`);
    },

    addRental: (data) => {
        return api.post('/staff/ops/rentals', data);
    },

    returnRental: (rentalId) => {
        return api.post(`/staff/ops/rentals/${rentalId}/return`);
    },

    // --- Dashboard Mock Data ---
    getDashboardStats: () => {
        return Promise.resolve({ data: { data: { todayCheckIns: 5, pendingCheckIns: 2, activeCourts: 3, totalCourts: 4, todayBookings: 8 } } });
    },

    getRecentCheckins: () => {
        return Promise.resolve({ data: { data: [] } });
    },

    getStaffActivities: () => {
        return Promise.resolve({ data: { data: [] } });
    }
};

export default staffOpsService;
