import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Mock mode
const MOCK_MODE = false;

// Mock courts data
const mockCourts = [
    {
        id: 1,
        name: 'Sân Cầu Lông Olympic',
        address: '123 Đường Láng, Đống Đa, Hà Nội',
        location: 'Hà Nội',
        price: 150000,
        priceWeekend: 200000,
        rating: 4.8,
        totalReviews: 124,
        status: 'available',
        image: 'https://via.placeholder.com/400x300',
        images: [
            'https://via.placeholder.com/800x600',
            'https://via.placeholder.com/800x600',
            'https://via.placeholder.com/800x600'
        ],
        description: 'Sân cầu lông chuyên nghiệp với đầy đủ tiện nghi, ánh sáng tốt, thoáng mát.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi', 'Căn tin'],
        openTime: '06:00',
        closeTime: '22:00',
        coordinates: { lat: 21.0245, lng: 105.8412 }
    },
    {
        id: 2,
        name: 'Champions Club',
        address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        location: 'Hà Nội',
        price: 180000,
        priceWeekend: 250000,
        rating: 4.9,
        totalReviews: 89,
        status: 'available',
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/800x600'],
        description: 'Hệ thống sân cầu lông cao cấp với trang thiết bị hiện đại.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi', 'Căn tin', 'Điều hòa'],
        openTime: '06:00',
        closeTime: '23:00',
        coordinates: { lat: 21.0167, lng: 105.7997 }
    },
    {
        id: 3,
        name: 'Badminton Arena',
        address: '789 Giải Phóng, Hai Bà Trưng, Hà Nội',
        location: 'Hà Nội',
        price: 120000,
        priceWeekend: 170000,
        rating: 4.5,
        totalReviews: 156,
        status: 'available',
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/800x600'],
        description: 'Sân rộng rãi, thoáng mát, giá cả hợp lý.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ'],
        openTime: '06:00',
        closeTime: '22:00',
        coordinates: { lat: 21.0034, lng: 105.8485 }
    },
    {
        id: 4,
        name: 'Sport Center Cầu Giấy',
        address: '321 Cầu Giấy, Cầu Giấy, Hà Nội',
        location: 'Hà Nội',
        price: 160000,
        priceWeekend: 220000,
        rating: 4.7,
        totalReviews: 98,
        status: 'maintenance',
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/800x600'],
        description: 'Trung tâm thể thao với nhiều tiện ích.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi', 'Gym'],
        openTime: '06:00',
        closeTime: '22:00',
        coordinates: { lat: 21.0333, lng: 105.7943 }
    },
    {
        id: 5,
        name: 'Golden Court',
        address: '555 Láng Hạ, Ba Đình, Hà Nội',
        location: 'Hà Nội',
        price: 200000,
        priceWeekend: 280000,
        rating: 5.0,
        totalReviews: 67,
        status: 'available',
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/800x600'],
        description: 'Sân cao cấp VIP, dành cho giải đấu chuyên nghiệp.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi', 'Căn tin', 'Điều hòa', 'Khán đài'],
        openTime: '06:00',
        closeTime: '23:00',
        coordinates: { lat: 21.0192, lng: 105.8119 }
    },
    {
        id: 6,
        name: 'Sân Thể Thao Mỹ Đình',
        address: '100 Mỹ Đình, Nam Từ Liêm, Hà Nội',
        location: 'Hà Nội',
        price: 140000,
        priceWeekend: 190000,
        rating: 4.6,
        totalReviews: 143,
        status: 'available',
        image: 'https://via.placeholder.com/400x300',
        images: ['https://via.placeholder.com/800x600'],
        description: 'Sân thuận tiện, gần khu vực Mỹ Đình.',
        amenities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi'],
        openTime: '06:00',
        closeTime: '22:00',
        coordinates: { lat: 21.0285, lng: 105.7654 }
    }
];

const courtService = {
    // Get all courts
    getCourts: async (params = {}) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let filtered = [...mockCourts];

                    // Filter by location
                    if (params.location) {
                        filtered = filtered.filter(court =>
                            court.location.toLowerCase().includes(params.location.toLowerCase())
                        );
                    }

                    // Filter by search query
                    if (params.search) {
                        filtered = filtered.filter(court =>
                            court.name.toLowerCase().includes(params.search.toLowerCase()) ||
                            court.address.toLowerCase().includes(params.search.toLowerCase())
                        );
                    }

                    // Filter by price
                    if (params.minPrice || params.maxPrice) {
                        filtered = filtered.filter(court => {
                            const price = court.price;
                            if (params.minPrice && price < params.minPrice) return false;
                            if (params.maxPrice && price > params.maxPrice) return false;
                            return true;
                        });
                    }

                    // Filter by rating
                    if (params.minRating) {
                        filtered = filtered.filter(court => court.rating >= params.minRating);
                    }

                    // Filter by status
                    if (params.status) {
                        filtered = filtered.filter(court => court.status === params.status);
                    }

                    resolve({
                        courts: filtered,
                        total: filtered.length,
                        page: params.page || 1,
                        limit: params.limit || 10
                    });
                }, 500);
            });
        }
        return api.get(API_ENDPOINTS.COURTS, { params });
    },

    // Get court by ID
    getCourtById: async (id) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const court = mockCourts.find(c => c.id === parseInt(id));
                    if (court) {
                        resolve(court);
                    } else {
                        reject({ message: 'Không tìm thấy sân' });
                    }
                }, 500);
            });
        }
        return api.get(API_ENDPOINTS.COURT_DETAIL(id));
    },

    // Get available time slots for a court
    getAvailableTimeSlots: async (courtId, date) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const slots = [];
                    for (let hour = 6; hour < 22; hour++) {
                        const time = `${hour.toString().padStart(2, '0')}:00`;
                        const isBooked = Math.random() > 0.6;
                        slots.push({
                            time,
                            available: !isBooked,
                            price: hour >= 17 ? 200000 : 150000
                        });
                    }
                    resolve(slots);
                }, 500);
            });
        }
        return api.get(`${API_ENDPOINTS.COURT_DETAIL(courtId)}/timeslots`, {
            params: { date }
        });
    },

    // Create court (owner/admin)
    createCourt: async (courtData) => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newCourt = {
                        id: Date.now(),
                        ...courtData,
                        rating: 0,
                        totalReviews: 0
                    };
                    mockCourts.push(newCourt);
                    resolve(newCourt);
                }, 1000);
            });
        }
        return api.post(API_ENDPOINTS.COURTS, courtData);
    },

    // Update court
    updateCourt: async (id, courtData) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = mockCourts.findIndex(c => c.id === parseInt(id));
                    if (index !== -1) {
                        mockCourts[index] = { ...mockCourts[index], ...courtData };
                        resolve(mockCourts[index]);
                    } else {
                        reject({ message: 'Không tìm thấy sân' });
                    }
                }, 1000);
            });
        }
        return api.put(API_ENDPOINTS.COURT_DETAIL(id), courtData);
    },

    // Delete court
    deleteCourt: async (id) => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = mockCourts.findIndex(c => c.id === parseInt(id));
                    if (index !== -1) {
                        mockCourts.splice(index, 1);
                        resolve({ message: 'Đã xóa sân thành công' });
                    } else {
                        reject({ message: 'Không tìm thấy sân' });
                    }
                }, 1000);
            });
        }
        return api.delete(API_ENDPOINTS.COURT_DETAIL(id));
    }
};

export default courtService;
