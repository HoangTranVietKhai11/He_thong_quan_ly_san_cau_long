// Vietnamese translations and constants
export const ROLES = {
    GUEST: 'guest',
    USER: 'user',
    OWNER: 'owner',
    STAFF: 'staff',
    ADMIN: 'admin'
};

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};

export const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành'
};

export const STATUS_COLORS = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'secondary'
};

// API endpoints (to be replaced with real backend)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Courts
    COURTS: '/courts',
    COURT_DETAIL: (id) => `/courts/${id}`,
    COURT_SEARCH: '/courts/search',

    // Bookings
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id) => `/bookings/${id}`,
    CREATE_BOOKING: '/bookings',
    CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`,

    // User
    PROFILE: '/user/profile',
    USER_BOOKINGS: '/user/bookings',

    // Owner
    OWNER_COURTS: '/owner/courts',
    OWNER_BOOKINGS: '/owner/bookings',
    OWNER_REVENUE: '/owner/revenue',

    // Admin
    ADMIN_USERS: '/admin/users',
    ADMIN_COURTS: '/admin/courts',
    ADMIN_STATS: '/admin/statistics'
};

// Time slots
export const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
];

// Price ranges for filtering
export const PRICE_RANGES = [
    { label: 'Dưới 100,000đ', min: 0, max: 100000 },
    { label: '100,000đ - 200,000đ', min: 100000, max: 200000 },
    { label: '200,000đ - 300,000đ', min: 200000, max: 300000 },
    { label: 'Trên 300,000đ', min: 300000, max: 9999999 }
];

// Rating options
export const RATING_OPTIONS = [
    { label: '5 sao', value: 5 },
    { label: '4 sao trở lên', value: 4 },
    { label: '3 sao trở lên', value: 3 }
];

// Vietnamese cities/locations
export const LOCATIONS = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Biên Hòa',
    'Nha Trang',
    'Huế',
    'Vũng Tàu'
];

// Navigation items for different roles
export const NAV_ITEMS = {
    guest: [
        { path: '/', label: 'Trang chủ', icon: 'house' },
        { path: '/about', label: 'Giới thiệu', icon: 'info-circle' }
    ],
    user: [
        { path: '/user/dashboard', label: 'Tổng quan', icon: 'speedometer2' },
        { path: '/user/bookings', label: 'Lịch đặt sân', icon: 'calendar-check' },
        { path: '/user/vouchers', label: 'Voucher', icon: 'tag' },
        { path: '/user/profile', label: 'Hồ sơ', icon: 'person' },
        { path: '/user/notifications', label: 'Thông báo', icon: 'bell' }
    ],
    staff: [
        { path: '/staff/dashboard', label: 'Tổng quan', icon: 'speedometer2' },
        { path: '/staff/checkin', label: 'Check-in', icon: 'check-circle' },
        { path: '/staff/courts', label: 'Quản lý sân', icon: 'grid' },
        { path: '/staff/vouchers', label: 'Quản lý voucher', icon: 'tag' },
        { path: '/staff/profile', label: 'Hồ sơ', icon: 'person' }
    ],
    owner: [
        { path: '/owner/dashboard', label: 'Tổng quan', icon: 'speedometer2' },
        { path: '/owner/courts', label: 'Quản lý sân', icon: 'building' },
        { path: '/owner/bookings', label: 'Đặt sân', icon: 'calendar-check' },
        { path: '/owner/revenue', label: 'Doanh thu', icon: 'graph-up' }
    ],
    admin: [
        { path: '/admin/dashboard', label: 'Tổng quan', icon: 'speedometer2' },

        // FE-01: Account Management & Security
        {
            label: 'Tài khoản & Bảo mật',
            icon: 'shield-lock',
            submenu: [
                { path: '/admin/users', label: 'Quản lý người dùng', icon: 'people' },
                { path: '/admin/users/permissions', label: 'Phân quyền', icon: 'key' },
                { path: '/admin/users/logs', label: 'Nhật ký hệ thống', icon: 'journal-text' },
                { path: '/admin/users/oauth', label: 'Đăng nhập xã hội', icon: 'share' },
                { path: '/admin/users/security', label: 'Bảo mật', icon: 'lock' }
            ]
        },

        // FE-02: Court & Infrastructure
        {
            label: 'Sân & Hạ tầng',
            icon: 'building',
            submenu: [
                { path: '/admin/courts', label: 'Quản lý sân', icon: 'grid' },
                { path: '/admin/courts/pricing', label: 'Giá sân theo giờ', icon: 'cash' },
                { path: '/admin/courts/maintenance', label: 'Lịch bảo trì', icon: 'tools' },
                { path: '/admin/courts/floor-plan', label: 'Sơ đồ mặt bằng', icon: 'map' },
                { path: '/admin/courts/repairs', label: 'Lịch sử sửa chữa', icon: 'wrench' },
                { path: '/admin/courts/alerts', label: 'Cảnh báo thiết bị', icon: 'exclamation-triangle' }
            ]
        },

        // FE-03: Booking Operations
        {
            label: 'Nghiệp vụ Đặt sân',
            icon: 'calendar-check',
            submenu: [
                { path: '/admin/bookings', label: 'Tất cả đặt sân', icon: 'list-ul' },
                { path: '/admin/bookings/conflicts', label: 'Xử lý trùng lịch', icon: 'exclamation-circle' },
                { path: '/admin/bookings/policies', label: 'Chính sách huỷ sân', icon: 'file-text' },
                { path: '/admin/bookings/checkin', label: 'Check-in/Check-out', icon: 'box-arrow-in-right' },
                { path: '/admin/bookings/errors', label: 'Xử lý booking lỗi', icon: 'bug' }
            ]
        },

        // FE-04: Finance & Payment
        {
            label: 'Tài chính',
            icon: 'cash-stack',
            submenu: [
                { path: '/admin/finance/deposits', label: 'Theo dõi cọc', icon: 'piggy-bank' },
                { path: '/admin/finance/counter', label: 'Thanh toán quầy', icon: 'calculator' },
                { path: '/admin/finance/overtime', label: 'Phụ phí quá giờ', icon: 'clock-history' },
                { path: '/admin/finance/vouchers', label: 'Quản lý voucher', icon: 'ticket-perforated' },
                { path: '/admin/finance/wallets', label: 'Ví điện tử', icon: 'wallet2' },
                { path: '/admin/finance/revenue', label: 'Báo cáo doanh thu', icon: 'graph-up-arrow' },
                { path: '/admin/finance/transactions', label: 'Giao dịch lỗi', icon: 'x-circle' }
            ]
        },

        // FE-05: Statistics & Reports
        {
            label: 'Thống kê & Báo cáo',
            icon: 'graph-up',
            submenu: [
                { path: '/admin/statistics', label: 'Tổng quan', icon: 'pie-chart' },
                { path: '/admin/statistics/bookings', label: 'Phân tích đặt sân', icon: 'bar-chart-line' },
                { path: '/admin/statistics/occupancy', label: 'Tỷ lệ sử dụng sân', icon: 'percent' },
                { path: '/admin/statistics/performance', label: 'Hiệu suất sân', icon: 'trophy' },
                { path: '/admin/statistics/reports', label: 'Tạo báo cáo', icon: 'file-earmark-spreadsheet' }
            ]
        },

        { path: '/admin/settings', label: 'Cài đặt', icon: 'gear' }
    ]
};
