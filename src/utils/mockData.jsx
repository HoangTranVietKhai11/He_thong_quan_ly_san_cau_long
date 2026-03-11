// Mock data for development and demo purposes
// Single Venue System - Courts represent individual courts AT the facility

// Individual Courts at "Sân Cầu Lông Code For App"
export const mockCourts = [
    {
        id: 1,
        courtNumber: 1,
        courtName: 'Court 1',
        type: 'VIP',
        pricePerHour: 100000,
        status: 'available', // available, in_use, maintenance, closed
        description: 'Sân VIP với ánh sáng LED chuyên dụng, mặt sân cao cấp',
        features: ['Ánh sáng LED cao cấp', 'Mặt sân chuyên nghiệp', 'Điều hòa'],
        lastMaintenance: '2026-01-25',
        nextMaintenance: '2026-02-25'
    },
    {
        id: 2,
        courtNumber: 2,
        courtName: 'Court 2',
        type: 'VIP',
        pricePerHour: 100000,
        status: 'available',
        description: 'Sân VIP với trang bị hiện đại nhất',
        features: ['Ánh sáng LED cao cấp', 'Mặt sân chuyên nghiệp', 'Điều hòa'],
        lastMaintenance: '2026-01-20',
        nextMaintenance: '2026-02-20'
    },
    {
        id: 3,
        courtNumber: 3,
        courtName: 'Court 3',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'in_use',
        description: 'Sân tiêu chuẩn chất lượng tốt',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-01-22',
        nextMaintenance: '2026-02-22'
    },
    {
        id: 4,
        courtNumber: 4,
        courtName: 'Court 4',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'available',
        description: 'Sân tiêu chuẩn phù hợp luyện tập',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-01-18',
        nextMaintenance: '2026-02-18'
    },
    {
        id: 5,
        courtNumber: 5,
        courtName: 'Court 5',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'available',
        description: 'Sân tiêu chuẩn, vị trí tốt',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-01-15',
        nextMaintenance: '2026-02-15'
    },
    {
        id: 6,
        courtNumber: 6,
        courtName: 'Court 6',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'maintenance',
        description: 'Sân tiêu chuẩn đang bảo trì',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-02-01',
        nextMaintenance: '2026-03-01',
        maintenanceNote: 'Thay mặt sân mới'
    },
    {
        id: 7,
        courtNumber: 7,
        courtName: 'Court 7',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'available',
        description: 'Sân tiêu chuẩn sạch sẽ',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-01-28',
        nextMaintenance: '2026-02-28'
    },
    {
        id: 8,
        courtNumber: 8,
        courtName: 'Court 8',
        type: 'STANDARD',
        pricePerHour: 80000,
        status: 'available',
        description: 'Sân tiêu chuẩn rộng rãi',
        features: ['Ánh sáng tốt', 'Mặt sân chuẩn'],
        lastMaintenance: '2026-01-30',
        nextMaintenance: '2026-03-02'
    }
];

export const mockBookings = [
    {
        id: 1,
        courtId: 3,
        courtName: 'Court 3',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-02-05',
        startTime: '08:00',
        endTime: '10:00',
        hours: 2,
        totalPrice: 160000,
        status: 'confirmed',
        courtNumber: 3,
        paymentStatus: 'paid',
        createdAt: '2026-02-01T10:30:00'
    },
    {
        id: 2,
        courtId: 1,
        courtName: 'Court 1',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-02-08',
        startTime: '18:00',
        endTime: '20:00',
        hours: 2,
        totalPrice: 200000,
        status: 'pending',
        courtNumber: 1,
        paymentStatus: 'pending',
        createdAt: '2026-02-01T11:15:00'
    },
    {
        id: 3,
        courtId: 2,
        courtName: 'Court 2',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-01-28',
        startTime: '07:00',
        endTime: '09:00',
        hours: 2,
        totalPrice: 200000,
        status: 'completed',
        courtNumber: 2,
        paymentStatus: 'paid',
        createdAt: '2026-01-25T09:20:00'
    },
    {
        id: 4,
        courtId: 4,
        courtName: 'Court 4',
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        date: '2026-01-30',
        startTime: '19:00',
        endTime: '21:00',
        hours: 2,
        totalPrice: 160000,
        status: 'completed',
        courtNumber: 4,
        paymentStatus: 'paid',
        createdAt: '2026-01-28T14:45:00'
    },
    {
        id: 5,
        courtId: 5,
        courtName: 'Court 5',
        userId: 2,
        userName: 'Trần Thị Lan',
        date: '2026-02-10',
        startTime: '14:00',
        endTime: '16:00',
        hours: 2,
        totalPrice: 160000,
        status: 'confirmed',
        courtNumber: 5,
        paymentStatus: 'paid',
        createdAt: '2026-02-01T08:00:00'
    }
];

export const mockUsers = [
    {
        id: 1,
        name: 'Nguyễn Văn Nam',
        email: 'nam.nguyen@example.com',
        phone: '0901234567',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=12',
        createdAt: '2025-12-01',
        totalBookings: 15,
        status: 'active'
    },
    {
        id: 2,
        name: 'Trần Thị Lan',
        email: 'lan.tran@example.com',
        phone: '0912345678',
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=5',
        createdAt: '2025-11-15',
        totalBookings: 8,
        status: 'active'
    },
    {
        id: 3,
        name: 'Nguyễn Văn A',
        email: 'owner1@example.com',
        phone: '0923456789',
        role: 'owner',
        avatar: 'https://i.pravatar.cc/150?img=33',
        createdAt: '2025-10-01',
        courtsOwned: 1,
        status: 'active'
    },
    {
        id: 4,
        name: 'Admin System',
        email: 'admin@badminton.com',
        phone: '0987654321',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=68',
        createdAt: '2025-01-01',
        status: 'active'
    }
];

export const mockNotifications = [
    {
        id: 1,
        userId: 1,
        title: 'Đặt sân thành công',
        message: 'Bạn đã đặt sân tại Sân Cầu Lông Thiên Phúc vào ngày 05/02/2026',
        type: 'success',
        read: false,
        createdAt: '2026-02-01T10:30:00'
    },
    {
        id: 2,
        userId: 1,
        title: 'Nhắc nhở đặt sân',
        message: 'Bạn có lịch đặt sân vào lúc 8:00 ngày mai tại Sân Cầu Lông Thiên Phúc',
        type: 'info',
        read: false,
        createdAt: '2026-02-04T18:00:00'
    },
    {
        id: 3,
        userId: 1,
        title: 'Thanh toán thành công',
        message: 'Thanh toán 160.000đ cho booking #1 đã được xác nhận',
        type: 'success',
        read: true,
        createdAt: '2026-02-01T10:31:00'
    }
];

export const mockReviews = [
    {
        id: 1,
        courtId: 1,
        userId: 1,
        userName: 'Nguyễn Văn Nam',
        rating: 5,
        comment: 'Sân đẹp, sạch sẽ, nhân viên nhiệt tình. Sẽ quay lại!',
        createdAt: '2026-01-29'
    },
    {
        id: 2,
        courtId: 1,
        userId: 2,
        userName: 'Trần Thị Lan',
        rating: 4,
        comment: 'Sân tốt, giá hợp lý. Chỗ đậu xe hơi chật một chút.',
        createdAt: '2026-01-28'
    }
];

export const mockStats = {
    user: {
        totalBookings: 15,
        upcomingBookings: 2,
        completedBookings: 13,
        totalSpent: 2250000,
        favoriteCourt: 'Sân Cầu Lông Thiên Phúc'
    },
    owner: {
        totalCourts: 8,
        todayBookings: 12,
        monthlyRevenue: 45600000,
        monthlyBookings: 234,
        occupancyRate: 78,
        topCourt: 'Sân số 3'
    },
    admin: {
        totalUsers: 1234,
        totalCourts: 45,
        totalBookings: 5678,
        todayBookings: 89,
        monthlyRevenue: 234500000,
        activeUsers: 456,
        newUsersThisMonth: 67
    }
};

export const mockRevenueData = [
    { month: 'T1', revenue: 32000000, bookings: 156 },
    { month: 'T2', revenue: 28000000, bookings: 142 },
    { month: 'T3', revenue: 35000000, bookings: 178 },
    { month: 'T4', revenue: 38000000, bookings: 191 },
    { month: 'T5', revenue: 42000000, bookings: 203 },
    { month: 'T6', revenue: 45000000, bookings: 215 },
    { month: 'T7', revenue: 48000000, bookings: 234 },
    { month: 'T8', revenue: 44000000, bookings: 221 },
    { month: 'T9', revenue: 40000000, bookings: 198 },
    { month: 'T10', revenue: 43000000, bookings: 207 },
    { month: 'T11', revenue: 46000000, bookings: 223 },
    { month: 'T12', revenue: 50000000, bookings: 241 }
];

// Vouchers
export const mockVouchers = [
    {
        id: 1,
        code: 'WELCOME10',
        description: 'Giảm 10% cho khách hàng mới',
        discount: 10,
        discountType: 'percentage', // percentage or fixed
        minBookingAmount: 100000,
        maxDiscount: 50000,
        validFrom: '2026-01-01',
        validUntil: '2026-12-31',
        usageLimit: 100,
        usedCount: 23,
        status: 'active',
        applicableTo: 'all' // all, specific courts
    },
    {
        id: 2,
        code: 'WEEKEND20',
        description: 'Giảm 20% đặt sân cuối tuần',
        discount: 20,
        discountType: 'percentage',
        minBookingAmount: 150000,
        maxDiscount: 100000,
        validFrom: '2026-02-01',
        validUntil: '2026-03-31',
        usageLimit: 50,
        usedCount: 12,
        status: 'active',
        applicableTo: 'weekend'
    },
    {
        id: 3,
        code: 'FLASH50K',
        description: 'Giảm 50.000đ cho đơn từ 200.000đ',
        discount: 50000,
        discountType: 'fixed',
        minBookingAmount: 200000,
        maxDiscount: 50000,
        validFrom: '2026-02-01',
        validUntil: '2026-02-15',
        usageLimit: 200,
        usedCount: 89,
        status: 'active',
        applicableTo: 'all'
    },
    {
        id: 4,
        code: 'VIP15',
        description: 'Giảm 15% cho sân VIP',
        discount: 15,
        discountType: 'percentage',
        minBookingAmount: 250000,
        maxDiscount: 150000,
        validFrom: '2026-01-15',
        validUntil: '2026-06-30',
        usageLimit: 30,
        usedCount: 8,
        status: 'active',
        applicableTo: 'vip'
    },
    {
        id: 5,
        code: 'EARLYBIRD',
        description: 'Giảm 25% đặt sân sáng sớm (6h-9h)',
        discount: 25,
        discountType: 'percentage',
        minBookingAmount: 80000,
        maxDiscount: 80000,
        validFrom: '2026-02-01',
        validUntil: '2026-04-30',
        usageLimit: 100,
        usedCount: 34,
        status: 'active',
        applicableTo: 'morning'
    }
];

// Payment Methods
export const mockPaymentMethods = [
    {
        id: 1,
        name: 'Tiền mặt',
        code: 'cash',
        description: 'Thanh toán bằng tiền mặt tại sân',
        icon: '💵',
        enabled: true,
        processingTime: 'Ngay lập tức'
    },
    {
        id: 2,
        name: 'Thẻ ATM/Visa/Master',
        code: 'card',
        description: 'Thanh toán qua thẻ ngân hàng',
        icon: '💳',
        enabled: true,
        processingTime: 'Ngay lập tức'
    },
    {
        id: 3,
        name: 'Ví điện tử MoMo',
        code: 'momo',
        description: 'Thanh toán qua ví MoMo',
        icon: '📱',
        enabled: true,
        processingTime: 'Ngay lập tức',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png'
    },
    {
        id: 4,
        name: 'ZaloPay',
        code: 'zalopay',
        description: 'Thanh toán qua ZaloPay',
        icon: '💰',
        enabled: true,
        processingTime: 'Ngay lập tức',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png'
    },
    {
        id: 5,
        name: 'Chuyển khoản ngân hàng',
        code: 'bank_transfer',
        description: 'Chuyển khoản qua QR Code',
        icon: '🏦',
        enabled: true,
        processingTime: '5-15 phút'
    },
    {
        id: 6,
        name: 'VNPay',
        code: 'vnpay',
        description: 'Thanh toán qua VNPay',
        icon: '🔵',
        enabled: true,
        processingTime: 'Ngay lập tức',
        logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png'
    }
];

// Pricing Tiers (Peak/Off-peak hours)
export const mockPricingTiers = {
    peakHours: [
        { start: '17:00', end: '22:00', multiplier: 1.3, label: 'Giờ cao điểm' },
        { start: '06:00', end: '08:00', multiplier: 1.0, label: 'Giờ sáng sớm' }
    ],
    offPeakHours: [
        { start: '08:00', end: '17:00', multiplier: 0.8, label: 'Giờ thấp điểm' },
        { start: '22:00', end: '23:00', multiplier: 0.9, label: 'Giờ muộn' }
    ],
    weekend: {
        multiplier: 1.2,
        label: 'Cuối tuần'
    },
    holiday: {
        multiplier: 1.5,
        label: 'Ngày lễ'
    }
};

// Court Availability (time slots)
export const mockAvailability = [
    { time: '06:00', available: true, price: 80000 },
    { time: '07:00', available: true, price: 80000 },
    { time: '08:00', available: false, price: 64000 },
    { time: '09:00', available: true, price: 64000 },
    { time: '10:00', available: true, price: 64000 },
    { time: '11:00', available: true, price: 64000 },
    { time: '12:00', available: false, price: 64000 },
    { time: '13:00', available: true, price: 64000 },
    { time: '14:00', available: true, price: 64000 },
    { time: '15:00', available: true, price: 64000 },
    { time: '16:00', available: true, price: 64000 },
    { time: '17:00', available: false, price: 104000 },
    { time: '18:00', available: true, price: 104000 },
    { time: '19:00', available: false, price: 104000 },
    { time: '20:00', available: true, price: 104000 },
    { time: '21:00', available: true, price: 104000 },
    { time: '22:00', available: true, price: 72000 }
];

// User's available vouchers
export const mockUserVouchers = [
    {
        id: 1,
        voucherId: 1,
        code: 'WELCOME10',
        status: 'available',
        expiresAt: '2026-12-31'
    },
    {
        id: 2,
        voucherId: 3,
        code: 'FLASH50K',
        status: 'available',
        expiresAt: '2026-02-15'
    },
    {
        id: 3,
        voucherId: 5,
        code: 'EARLYBIRD',
        status: 'available',
        expiresAt: '2026-04-30'
    },
    {
        id: 4,
        voucherId: 2,
        code: 'WEEKEND20',
        status: 'used',
        usedAt: '2026-01-28',
        expiresAt: '2026-03-31'
    }
];

// Staff Mock Data
export const mockStaff = [
    {
        id: 5,
        name: 'Trần Văn Staff',
        email: 'staff@example.com',
        phone: '0934567890',
        role: 'staff',
        avatar: 'https://i.pravatar.cc/150?img=15',
        assignedCourt: 1,
        shift: 'morning', // morning, afternoon, evening, full
        createdAt: '2025-11-01',
        status: 'active'
    },
    {
        id: 6,
        name: 'Lê Thị Nhân Viên',
        email: 'staff2@example.com',
        phone: '0945678901',
        role: 'staff',
        avatar: 'https://i.pravatar.cc/150?img=25',
        assignedCourt: 2,
        shift: 'afternoon',
        createdAt: '2025-12-15',
        status: 'active'
    }
];

// Check-in History
export const mockCheckIns = [
    {
        id: 1,
        bookingId: 1,
        customerId: 1,
        customerName: 'Nguyễn Văn Nam',
        checkInTime: '2026-02-01T08:05:00',
        staffId: 5,
        staffName: 'Trần Văn Staff',
        courtNumber: 3,
        notes: 'Khách đến đúng giờ'
    },
    {
        id: 2,
        bookingId: 5,
        customerId: 2,
        customerName: 'Trần Thị Lan',
        checkInTime: '2026-02-01T14:10:00',
        staffId: 5,
        staffName: 'Trần Văn Staff',
        courtNumber: 1,
        notes: ''
    },
    {
        id: 3,
        bookingId: 3,
        customerId: 1,
        customerName: 'Nguyễn Văn Nam',
        checkInTime: '2026-01-28T07:05:00',
        staffId: 6,
        staffName: 'Lê Thị Nhân Viên',
        courtNumber: 2,
        notes: 'Khách yêu cầu đổi sân'
    }
];

// Court Status (Real-time tracking)
export const mockCourtStatus = [
    {
        id: 1,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        courtNumber: 1,
        status: 'available', // available, in_use, maintenance, closed
        currentBooking: null,
        nextBooking: {
            time: '14:00',
            customerName: 'Trần Thị Lan'
        },
        lastUpdated: '2026-02-01T07:00:00',
        lastMaintenance: '2026-01-25',
        notes: ''
    },
    {
        id: 2,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        courtNumber: 2,
        status: 'in_use',
        currentBooking: {
            bookingId: 8,
            customerName: 'Phạm Văn Hùng',
            startTime: '10:00',
            endTime: '12:00'
        },
        nextBooking: {
            time: '14:00',
            customerName: 'Hoàng Thị Linh'
        },
        lastUpdated: '2026-02-01T10:00:00',
        lastMaintenance: '2026-01-20',
        notes: ''
    },
    {
        id: 3,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        courtNumber: 3,
        status: 'maintenance',
        currentBooking: null,
        nextBooking: null,
        lastUpdated: '2026-02-01T06:00:00',
        lastMaintenance: '2026-02-01',
        notes: 'Thay lưới mới, sơn lại mặt sân',
        estimatedCompletion: '2026-02-01T16:00:00'
    },
    {
        id: 4,
        courtId: 1,
        courtName: 'Sân Cầu Lông Thiên Phúc',
        courtNumber: 4,
        status: 'available',
        currentBooking: null,
        nextBooking: {
            time: '18:00',
            customerName: 'Nguyễn Thị Mai'
        },
        lastUpdated: '2026-02-01T07:00:00',
        lastMaintenance: '2026-01-28',
        notes: ''
    }
];

// Staff Activity Logs
export const mockStaffActivities = [
    {
        id: 1,
        staffId: 5,
        staffName: 'Trần Văn Staff',
        action: 'check_in',
        description: 'Check-in booking #1 - Nguyễn Văn Nam',
        timestamp: '2026-02-01T08:05:00'
    },
    {
        id: 2,
        staffId: 5,
        staffName: 'Trần Văn Staff',
        action: 'court_status',
        description: 'Chuyển sân #3 sang trạng thái bảo trì',
        timestamp: '2026-02-01T06:00:00'
    },
    {
        id: 3,
        staffId: 6,
        staffName: 'Lê Thị Nhân Viên',
        action: 'voucher_create',
        description: 'Tạo voucher mới: NEWUSER15',
        timestamp: '2026-01-31T15:30:00'
    }
];

// Today's Stats for Staff Dashboard
export const mockStaffStats = {
    todayCheckIns: 12,
    pendingCheckIns: 5,
    activeCourts: 6,
    maintenanceCourts: 1,
    closedCourts: 1,
    totalCourts: 8,
    todayBookings: 18,
    activeVouchers: 5
};

