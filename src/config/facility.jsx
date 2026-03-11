// Facility Configuration - Single Venue System
// This represents THE badminton facility being managed

export const FACILITY_INFO = {
    id: 1,
    name: 'Sân Cầu Lông Code For App',
    shortName: 'Code For App Badminton',
    address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    phone: '0901234567',
    email: 'contact@codeforapp.com',

    // Operating hours
    openTime: '06:00',
    closeTime: '22:00',

    // Business info
    description: 'Sân cầu lông chuyên nghiệp với trang thiết bị hiện đại, phục vụ tận tình 24/7',
    owner: 'Nguyễn Văn A',
    established: '2024-01-01',

    // Features
    features: [
        'Sân thi đấu chuẩn quốc tế',
        'Trang thiết bị hiện đại',
        'Phòng thay đồ rộng rãi',
        'Wifi miễn phí',
        'Bãi đỗ xe rộng rãi',
        'Căn tin phục vụ đồ uống'
    ],

    // Social media
    facebook: 'https://facebook.com/codeforapp',
    instagram: 'https://instagram.com/codeforapp',

    // Location
    mapUrl: 'https://maps.google.com/?q=123+Nguyen+Van+Linh+Q7+HCMC',

    // Images
    logo: '/logo-facility.png',
    coverImage: '/facility-cover.jpg',
    galleryImages: [
        '/gallery/court1.jpg',
        '/gallery/court2.jpg',
        '/gallery/facilities.jpg'
    ]
};

// Court Types Configuration
export const COURT_TYPES = {
    VIP: {
        name: 'VIP',
        description: 'Sân VIP với ánh sáng tốt nhất, mới nhất',
        basePrice: 100000,
        color: '#FFD700' // Gold
    },
    STANDARD: {
        name: 'Tiêu chuẩn',
        description: 'Sân tiêu chuẩn chất lượng tốt',
        basePrice: 80000,
        color: '#3b82f6' // Blue
    }
};

// Time Slot Configuration
export const TIME_SLOTS = {
    // Giờ vàng (peak hours)
    PEAK: {
        name: 'Giờ vàng',
        timeRanges: [
            { start: '17:00', end: '21:00' }
        ],
        priceMultiplier: 1.2 // +20%
    },
    // Giờ thường
    NORMAL: {
        name: 'Giờ thường',
        timeRanges: [
            { start: '06:00', end: '17:00' },
            { start: '21:00', end: '22:00' }
        ],
        priceMultiplier: 1.0
    }
};

export default FACILITY_INFO;
