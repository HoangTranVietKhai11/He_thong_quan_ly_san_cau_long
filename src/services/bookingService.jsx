import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { generateBookingId } from '../utils/helpers';
import { storage } from '../utils/helpers';

// Mock mode
const MOCK_MODE = false;

// Get mock bookings from localStorage
const getMockBookings = () => {
    return storage.get('mock_bookings') || [];
};

// Save mock bookings to localStorage
const saveMockBookings = (bookings) => {
    storage.set('mock_bookings', bookings);
};

const bookingService = {
    // Create booking
    createBooking: async (bookingData) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const booking = {
                        id: generateBookingId(),
                        ...bookingData,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    const bookings = getMockBookings();
                    bookings.push(booking);
                    saveMockBookings(bookings);

                    resolve(booking);
                }, 1000);
            });
        }
        return api.post(API_ENDPOINTS.CREATE_BOOKING, bookingData);
    },

    // Get all bookings (for current user)
    getBookings: async (params = {}) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let bookings = getMockBookings();
                    const user = storage.get('user');

                    // Filter by user
                    if (user && user.role === 'user') {
                        bookings = bookings.filter(b => b.userId === user.id);
                    }

                    // Filter by status
                    if (params.status) {
                        bookings = bookings.filter(b => b.status === params.status);
                    }

                    // Sort by date
                    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    resolve({
                        bookings,
                        total: bookings.length
                    });
                }, 500);
            });
        }
        return api.get(API_ENDPOINTS.BOOKINGS, { params });
    },

    // Get booking by ID
    getBookingById: async (id) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookings = getMockBookings();
                    const booking = bookings.find(b => b.id === id);

                    if (booking) {
                        resolve(booking);
                    } else {
                        reject({ message: 'Không tìm thấy đơn đặt sân' });
                    }
                }, 500);
            });
        }
        return api.get(API_ENDPOINTS.BOOKING_DETAIL(id));
    },

    // Cancel booking
    cancelBooking: async (id) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookings = getMockBookings();
                    const index = bookings.findIndex(b => b.id === id);

                    if (index !== -1) {
                        bookings[index].status = 'cancelled';
                        bookings[index].updatedAt = new Date().toISOString();
                        saveMockBookings(bookings);
                        resolve(bookings[index]);
                    } else {
                        reject({ message: 'Không tìm thấy đơn đặt sân' });
                    }
                }, 1000);
            });
        }
        return api.post(API_ENDPOINTS.CANCEL_BOOKING(id));
    },

    // Update booking status (owner/admin)
    updateBookingStatus: async (id, status) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookings = getMockBookings();
                    const index = bookings.findIndex(b => b.id === id);

                    if (index !== -1) {
                        bookings[index].status = status;
                        bookings[index].updatedAt = new Date().toISOString();
                        saveMockBookings(bookings);
                        resolve(bookings[index]);
                    } else {
                        reject({ message: 'Không tìm thấy đơn đặt sân' });
                    }
                }, 1000);
            });
        }
        return api.put(API_ENDPOINTS.BOOKING_DETAIL(id), { status });
    },

    // Get bookings for owner
    getOwnerBookings: async (params = {}) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let bookings = getMockBookings();
                    const user = storage.get('user');

                    // Filter by owner's courts (simplified - in real app, filter by court ownership)
                    // For now, return all bookings for demo

                    // Filter by status
                    if (params.status) {
                        bookings = bookings.filter(b => b.status === params.status);
                    }

                    // Sort by date
                    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    resolve({
                        bookings,
                        total: bookings.length
                    });
                }, 500);
            });
        }
        return api.get(API_ENDPOINTS.OWNER_BOOKINGS, { params });
    },

    // Get booking statistics
    getBookingStats: async () => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const bookings = getMockBookings();

                    const stats = {
                        total: bookings.length,
                        pending: bookings.filter(b => b.status === 'pending').length,
                        confirmed: bookings.filter(b => b.status === 'confirmed').length,
                        cancelled: bookings.filter(b => b.status === 'cancelled').length,
                        completed: bookings.filter(b => b.status === 'completed').length,
                        revenue: bookings
                            .filter(b => b.status === 'completed')
                            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                    };

                    resolve(stats);
                }, 500);
            });
        }
        return api.get('/bookings/stats');
    }
};

export default bookingService;
