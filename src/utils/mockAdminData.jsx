// Extended mock data for admin modules
import { mockCourts } from './mockData';

// FE-02: Floor Plan Booking Overlays (real-time court status with customer info)
export const mockFloorPlanStatus = [
    { courtId: 1, status: 'available', currentBooking: null },
    { courtId: 2, status: 'in_use', currentBooking: { customerName: 'Nguyễn Văn A', startTime: '17:00', endTime: '18:00', phone: '0901234567' } },
    { courtId: 3, status: 'available', currentBooking: null },
    { courtId: 4, status: 'in_use', currentBooking: { customerName: 'Trần Thị B', startTime: '17:00', endTime: '19:00', phone: '0907654321' } },
    { courtId: 5, status: 'maintenance', currentBooking: null },
    { courtId: 6, status: 'available', currentBooking: null },
    { courtId: 7, status: 'in_use', currentBooking: { customerName: 'Lê Văn C', startTime: '16:00', endTime: '18:00', phone: '0912345678' } },
    { courtId: 8, status: 'closed', currentBooking: null },
];

// FE-02.9: Court Usage History
export const mockCourtUsageHistory = [
    { id: 1, courtId: 1, courtName: 'Sân 1', date: '2026-02-28', customer: 'Nguyễn Văn A', timeSlot: '08:00 - 09:00', duration: 1, price: 80000, type: 'STANDARD' },
    { id: 2, courtId: 2, courtName: 'Sân 2', date: '2026-02-28', customer: 'Trần Thị B', timeSlot: '17:00 - 19:00', duration: 2, price: 240000, type: 'VIP' },
    { id: 3, courtId: 1, courtName: 'Sân 1', date: '2026-02-27', customer: 'Lê Văn C', timeSlot: '19:00 - 21:00', duration: 2, price: 240000, type: 'STANDARD' },
    { id: 4, courtId: 3, courtName: 'Sân 3', date: '2026-02-27', customer: 'Phạm Thị D', timeSlot: '10:00 - 12:00', duration: 2, price: 300000, type: 'VIP' },
    { id: 5, courtId: 4, courtName: 'Sân 4', date: '2026-02-26', customer: 'Hoàng Văn E', timeSlot: '14:00 - 16:00', duration: 2, price: 160000, type: 'STANDARD' },
    { id: 6, courtId: 2, courtName: 'Sân 2', date: '2026-02-26', customer: 'Nguyễn Văn A', timeSlot: '09:00 - 11:00', duration: 2, price: 300000, type: 'VIP' },
    { id: 7, courtId: 5, courtName: 'Sân 5', date: '2026-02-25', customer: 'Trần Văn F', timeSlot: '20:00 - 22:00', duration: 2, price: 300000, type: 'STANDARD' },
    { id: 8, courtId: 1, courtName: 'Sân 1', date: '2026-02-25', customer: 'Lê Thị G', timeSlot: '06:00 - 07:00', duration: 1, price: 80000, type: 'STANDARD' },
];

export const mockUsageStats = {
    totalSessions: 142,
    totalRevenue: 18500000,
    avgDuration: 1.8,
    mostPopularCourt: 'Sân 2',
    mostPopularTimeSlot: '17:00 - 19:00',
    byCourtData: [
        { courtId: 1, courtName: 'Sân 1', sessions: 32, revenue: 3200000 },
        { courtId: 2, courtName: 'Sân 2', sessions: 28, revenue: 4200000 },
        { courtId: 3, courtName: 'Sân 3', sessions: 22, revenue: 3300000 },
        { courtId: 4, courtName: 'Sân 4', sessions: 18, revenue: 1440000 },
        { courtId: 5, courtName: 'Sân 5', sessions: 20, revenue: 3000000 },
        { courtId: 6, courtName: 'Sân 6', sessions: 12, revenue: 1800000 },
        { courtId: 7, courtName: 'Sân 7', sessions: 6, revenue: 900000 },
        { courtId: 8, courtName: 'Sân 8', sessions: 4, revenue: 600000 },
    ]
};

// FE-02.10: Equipment Inventory for Staff
export const mockEquipmentInventory = [
    { id: 1, name: 'Cầu lông (hộp)', quantity: 5, minQuantity: 10, unit: 'hộp', location: 'Kho A', lastUpdated: '2026-02-28', supplier: 'Yonex VN' },
    { id: 2, name: 'Vợt cầu lông', quantity: 12, minQuantity: 8, unit: 'cái', location: 'Quầy lễ tân', lastUpdated: '2026-02-25', supplier: 'Victor VN' },
    { id: 3, name: 'Lưới sân (bộ)', quantity: 2, minQuantity: 3, unit: 'bộ', location: 'Kho A', lastUpdated: '2026-02-20', supplier: 'Nội địa' },
    { id: 4, name: 'Khăn lau', quantity: 8, minQuantity: 20, unit: 'cái', location: 'Phòng thay đồ', lastUpdated: '2026-02-28', supplier: 'Nội địa' },
    { id: 5, name: 'Bình nước (500ml)', quantity: 24, minQuantity: 12, unit: 'chai', location: 'Quầy bán hàng', lastUpdated: '2026-03-01', supplier: 'La Vie' },
    { id: 6, name: 'Đèn LED thay thế', quantity: 4, minQuantity: 6, unit: 'bóng', location: 'Kho B', lastUpdated: '2026-02-15', supplier: 'Philips VN' },
    { id: 7, name: 'Băng dán sân', quantity: 3, minQuantity: 2, unit: 'cuộn', location: 'Kho A', lastUpdated: '2026-02-22', supplier: 'Nội địa' },
    { id: 8, name: 'Xịt khử mùi', quantity: 1, minQuantity: 5, unit: 'bình', location: 'Phòng thay đồ', lastUpdated: '2026-02-28', supplier: 'Nội địa' },
];

// FE-02: Court Pricing Data
export const mockCourtPricing = {
    // Time slots (6:00 - 23:00, mỗi slot 1 giờ)
    timeSlots: [
        { id: 1, start: '06:00', end: '07:00', label: '06:00 - 07:00' },
        { id: 2, start: '07:00', end: '08:00', label: '07:00 - 08:00' },
        { id: 3, start: '08:00', end: '09:00', label: '08:00 - 09:00' },
        { id: 4, start: '09:00', end: '10:00', label: '09:00 - 10:00' },
        { id: 5, start: '10:00', end: '11:00', label: '10:00 - 11:00' },
        { id: 6, start: '11:00', end: '12:00', label: '11:00 - 12:00' },
        { id: 7, start: '12:00', end: '13:00', label: '12:00 - 13:00' },
        { id: 8, start: '13:00', end: '14:00', label: '13:00 - 14:00' },
        { id: 9, start: '14:00', end: '15:00', label: '14:00 - 15:00' },
        { id: 10, start: '15:00', end: '16:00', label: '15:00 - 16:00' },
        { id: 11, start: '16:00', end: '17:00', label: '16:00 - 17:00' },
        { id: 12, start: '17:00', end: '18:00', label: '17:00 - 18:00' },
        { id: 13, start: '18:00', end: '19:00', label: '18:00 - 19:00' },
        { id: 14, start: '19:00', end: '20:00', label: '19:00 - 20:00' },
        { id: 15, start: '20:00', end: '21:00', label: '20:00 - 21:00' },
        { id: 16, start: '21:00', end: '22:00', label: '21:00 - 22:00' },
        { id: 17, start: '22:00', end: '23:00', label: '22:00 - 23:00' },
    ],

    // Pricing tiers
    pricingTiers: {
        offPeak: { name: 'Giờ thấp điểm', price: 80000, color: '#28a745' }, // 6-9, 14-17
        peak: { name: 'Giờ cao điểm', price: 120000, color: '#ffc107' },    // 17-21
        vip: { name: 'Giờ vàng', price: 150000, color: '#dc3545' },         // 9-14, 21-23
    },

    // Price matrix (timeSlotId => tier)
    priceMatrix: {
        1: 'offPeak',  // 06:00
        2: 'offPeak',  // 07:00
        3: 'offPeak',  // 08:00
        4: 'vip',      // 09:00
        5: 'vip',      // 10:00
        6: 'vip',      // 11:00
        7: 'vip',      // 12:00
        8: 'vip',      // 13:00
        9: 'offPeak',  // 14:00
        10: 'offPeak', // 15:00
        11: 'offPeak', // 16:00
        12: 'peak',    // 17:00
        13: 'peak',    // 18:00
        14: 'peak',    // 19:00
        15: 'peak',    // 20:00
        16: 'vip',     // 21:00
        17: 'vip',     // 22:00
    }
};

// FE-02: Maintenance Schedule
export const mockMaintenanceSchedule = [
    {
        id: 1,
        courtId: 1,
        courtName: 'Sân 1',
        type: 'Bảo trì định kỳ',
        description: 'Thay lưới, sơn sân',
        scheduledDate: '2026-02-10',
        duration: '4 giờ',
        status: 'scheduled',
        assignedTo: 'Nguyễn Văn A',
        estimatedCost: 2000000
    },
    {
        id: 2,
        courtId: 3,
        courtName: 'Sân 3',
        type: 'Sửa chữa khẩn cấp',
        description: 'Sửa đèn chiếu sáng',
        scheduledDate: '2026-02-05',
        duration: '2 giờ',
        status: 'in_progress',
        assignedTo: 'Trần Văn B',
        estimatedCost: 500000
    },
    {
        id: 3,
        courtId: 5,
        courtName: 'Sân 5',
        type: 'Bảo trì định kỳ',
        description: 'Kiểm tra hệ thống điện',
        scheduledDate: '2026-02-15',
        duration: '3 giờ',
        status: 'scheduled',
        assignedTo: 'Lê Văn C',
        estimatedCost: 1000000
    },
    {
        id: 4,
        courtId: 2,
        courtName: 'Sân 2',
        type: 'Vệ sinh',
        description: 'Vệ sinh tổng thể sân',
        scheduledDate: '2026-02-03',
        duration: '1 giờ',
        status: 'completed',
        assignedTo: 'Nguyễn Thị D',
        estimatedCost: 200000
    }
];

// FE-02: Repair History
export const mockRepairHistory = [
    {
        id: 1,
        courtId: 1,
        courtName: 'Sân 1',
        issueType: 'Lưới hư',
        description: 'Lưới bị đứt, cần thay mới',
        reportedDate: '2026-01-20',
        repairedDate: '2026-01-22',
        cost: 800000,
        repairedBy: 'Nguyễn Văn A',
        severity: 'medium',
        downtime: '2 ngày'
    },
    {
        id: 2,
        courtId: 4,
        courtName: 'Sân 4',
        issueType: 'Đèn hỏng',
        description: 'Đèn chiếu sáng không sáng',
        reportedDate: '2026-01-15',
        repairedDate: '2026-01-16',
        cost: 400000,
        repairedBy: 'Trần Văn B',
        severity: 'high',
        downtime: '1 ngày'
    },
    {
        id: 3,
        courtId: 7,
        courtName: 'Sân 7',
        issueType: 'Sàn sân',
        description: 'Sàn bị trầy xước, cần đánh bóng',
        reportedDate: '2026-01-10',
        repairedDate: '2026-01-14',
        cost: 2000000,
        repairedBy: 'Lê Văn C',
        severity: 'low',
        downtime: '4 ngày'
    },
    {
        id: 4,
        courtId: 3,
        courtName: 'Sân 3',
        issueType: 'Hệ thống điện',
        description: 'Cầu dao bị hỏng',
        reportedDate: '2026-01-25',
        repairedDate: '2026-01-25',
        cost: 300000,
        repairedBy: 'Nguyễn Văn A',
        severity: 'critical',
        downtime: '4 giờ'
    }
];

// FE-02: Equipment Alerts
export const mockEquipmentAlerts = [
    {
        id: 1,
        courtId: 2,
        courtName: 'Sân 2',
        equipmentType: 'Lưới',
        alertType: 'Cần thay',
        description: 'Lưới đã sử dụng 6 tháng, nên thay mới',
        severity: 'medium',
        createdDate: '2026-02-01',
        status: 'pending',
        estimatedCost: 700000
    },
    {
        id: 2,
        courtId: 6,
        courtName: 'Sân 6',
        equipmentType: 'Đèn LED',
        alertType: 'Hư hỏng',
        description: '2/4 bóng đèn không sáng',
        severity: 'high',
        createdDate: '2026-02-02',
        status: 'urgent',
        estimatedCost: 500000
    },
    {
        id: 3,
        courtId: 8,
        courtName: 'Sân 8',
        equipmentType: 'Sàn gỗ',
        alertType: 'Bảo trì',
        description: 'Sàn cần đánh bóng định kỳ',
        severity: 'low',
        createdDate: '2026-01-28',
        status: 'scheduled',
        estimatedCost: 1500000
    },
    {
        id: 4,
        courtId: 4,
        courtName: 'Sân 4',
        equipmentType: 'Điều hòa',
        description: 'Điều hòa chạy kém, cần bảo dưỡng',
        alertType: 'Bảo dưỡng',
        severity: 'medium',
        createdDate: '2026-01-30',
        status: 'pending',
        estimatedCost: 800000
    }
];

// Status labels
export const MAINTENANCE_STATUS = {
    scheduled: 'Đã lên lịch',
    in_progress: 'Đang thực hiện',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};

export const ALERT_SEVERITY = {
    low: { label: 'Thấp', color: 'info' },
    medium: { label: 'Trung bình', color: 'warning' },
    high: { label: 'Cao', color: 'danger' },
    critical: { label: 'Nghiêm trọng', color: 'danger' }
};

export const ALERT_STATUS = {
    pending: 'Chờ xử lý',
    scheduled: 'Đã lên lịch',
    urgent: 'Khẩn cấp',
    resolved: 'Đã giải quyết'
};

// ============ FE-03: BOOKING OPERATIONS ============

// All Bookings
export const mockBookings = [
    {
        id: 'BK001',
        userId: 1,
        userName: 'Nguyễn Văn A',
        userPhone: '0901234567',
        courtId: 1,
        courtName: 'Sân 1',
        date: '2026-02-05',
        timeSlot: '18:00 - 19:00',
        price: 120000,
        status: 'confirmed',       // pending, confirmed, checked_in, completed, cancelled
        paymentStatus: 'paid',     // pending, paid, refunded
        createdAt: '2026-02-01 10:30',
        notes: 'Khách quen'
    },
    {
        id: 'BK002',
        userId: 2,
        userName: 'Trần Thị B',
        userPhone: '0907654321',
        courtId: 3,
        courtName: 'Sân 3',
        date: '2026-02-06',
        timeSlot: '16:00 - 17:00',
        price: 80000,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2026-02-02 14:20',
        notes: ''
    },
    {
        id: 'BK003',
        userId: 3,
        userName: 'Lê Văn C',
        userPhone: '0912345678',
        courtId: 5,
        courtName: 'Sân 5',
        date: '2026-02-03',
        timeSlot: '20:00 - 21:00',
        price: 150000,
        status: 'completed',
        paymentStatus: 'paid',
        createdAt: '2026-01-30 09:15',
        notes: 'Đã hoàn thành'
    },
    {
        id: 'BK004',
        userId: 1,
        userName: 'Nguyễn Văn A',
        userPhone: '0901234567',
        courtId: 2,
        courtName: 'Sân 2',
        date: '2026-02-04',
        timeSlot: '19:00 - 20:00',
        price: 120000,
        status: 'checked_in',
        paymentStatus: 'paid',
        createdAt: '2026-02-01 16:45',
        notes: 'Đã check-in'
    },
    {
        id: 'BK005',
        userId: 4,
        userName: 'Phạm Thị D',
        userPhone: '0923456789',
        courtId: 4,
        courtName: 'Sân 4',
        date: '2026-02-07',
        timeSlot: '10:00 - 11:00',
        price: 150000,
        status: 'cancelled',
        paymentStatus: 'refunded',
        createdAt: '2026-02-01 11:00',
        notes: 'Khách hủy, đã hoàn tiền'
    }
];

// Booking Conflicts
export const mockBookingConflicts = [
    {
        id: 1,
        courtId: 2,
        courtName: 'Sân 2',
        date: '2026-02-05',
        timeSlot: '18:00 - 19:00',
        conflictType: 'double_booking',
        bookings: [
            { id: 'BK006', userName: 'User A', time: '18:00-19:00' },
            { id: 'BK007', userName: 'User B', time: '18:00-19:00' }
        ],
        status: 'pending',
        createdAt: '2026-02-04 15:30'
    },
    {
        id: 2,
        courtId: 6,
        courtName: 'Sân 6',
        date: '2026-02-06',
        timeSlot: '17:00 - 18:00',
        conflictType: 'maintenance_overlap',
        description: 'Sân đang bảo trì nhưng có booking',
        status: 'resolved',
        resolution: 'Chuyển sang sân 7',
        createdAt: '2026-02-03 10:00',
        resolvedAt: '2026-02-03 14:30'
    }
];

// Cancellation Policies
export const mockCancellationPolicies = [
    {
        id: 1,
        name: 'Miễn phí hủy',
        description: 'Hủy trước 24h - hoàn 100%',
        minHours: 24,
        refundPercent: 100,
        isActive: true
    },
    {
        id: 2,
        name: 'Hủy muộn',
        description: 'Hủy trong vòng 24h - hoàn 50%',
        minHours: 0,
        maxHours: 24,
        refundPercent: 50,
        isActive: true
    },
    {
        id: 3,
        name: 'Hủy quá trễ',
        description: 'Hủy sau giờ đặt - không hoàn tiền',
        minHours: -999,
        maxHours: 0,
        refundPercent: 0,
        isActive: true
    }
];

// Check-in Management
export const mockCheckIns = [
    {
        id: 1,
        bookingId: 'BK001',
        courtName: 'Sân 1',
        userName: 'Nguyễn Văn A',
        date: '2026-02-05',
        timeSlot: '18:00 - 19:00',
        checkInTime: '17:55',
        checkOutTime: null,
        status: 'checked_in',
        staffName: 'Nhân viên X'
    },
    {
        id: 2,
        bookingId: 'BK003',
        courtName: 'Sân 5',
        userName: 'Lê Văn C',
        date: '2026-02-03',
        timeSlot: '20:00 - 21:00',
        checkInTime: '19:58',
        checkOutTime: '21:05',
        overtime: 5,
        overtimeFee: 20000,
        status: 'checked_out',
        staffName: 'Nhân viên Y'
    }
];

// Booking Errors
export const mockBookingErrors = [
    {
        id: 1,
        errorType: 'payment_failed',
        bookingId: 'BK008',
        userName: 'User X',
        description: 'Thanh toán thất bại do hết hạn thẻ',
        occurredAt: '2026-02-02 14:30',
        status: 'resolved',
        resolution: 'Khách thanh toán lại thành công'
    },
    {
        id: 2,
        errorType: 'system_error',
        bookingId: 'BK009',
        userName: 'User Y',
        description: 'Lỗi hệ thống khi tạo booking',
        occurredAt: '2026-02-03 09:15',
        status: 'pending',
        resolution: null
    },
    {
        id: 3,
        errorType: 'double_booking',
        bookingId: null,
        description: 'Hệ thống cho phép đặt 2 booking trùng giờ',
        courtName: 'Sân 4',
        occurredAt: '2026-02-01 16:00',
        status: 'investigating'
    }
];

export const BOOKING_STATUS = {
    pending: { label: 'Chờ xác nhận', color: 'warning' },
    confirmed: { label: 'Đã xác nhận', color: 'primary' },
    checked_in: { label: 'Đã check-in', color: 'info' },
    completed: { label: 'Hoàn thành', color: 'success' },
    cancelled: { label: 'Đã hủy', color: 'secondary' }
};

export const PAYMENT_STATUS = {
    pending: { label: 'Chờ thanh toán', color: 'warning' },
    paid: { label: 'Đã thanh toán', color: 'success' },
    refunded: { label: 'Đã hoàn tiền', color: 'info' }
};

// ============ FE-04: FINANCE & PAYMENT ============

// Deposits
export const mockDeposits = [
    {
        id: 'DEP001',
        bookingId: 'BK001',
        userName: 'Nguyễn Văn A',
        amount: 50000,
        totalPrice: 120000,
        depositDate: '2026-02-01',
        dueDate: '2026-02-05',
        status: 'active',        // active, completed, expired, refunded
        paymentMethod: 'bank_transfer'
    },
    {
        id: 'DEP002',
        bookingId: 'BK010',
        userName: 'Trần Thị B',
        amount: 100000,
        totalPrice: 200000,
        depositDate: '2026-01-28',
        dueDate: '2026-02-10',
        status: 'completed',
        paymentMethod: 'cash'
    }
];

// Counter Payments
export const mockCounterPayments = [
    {
        id: 'CP001',
        bookingId: 'BK003',
        userName: 'Lê Văn C',
        amount: 120000,
        paymentDate: '2026-02-03',
        paymentTime: '18:00',
        cashier: 'Nhân viên X',
        method: 'cash'
    },
    {
        id: 'CP002',
        bookingId: 'BK004',
        userName: 'Nguyễn Văn A',
        amount: 150000,
        paymentDate: '2026-02-04',
        paymentTime: '10:30',
        cashier: 'Nhân viên Y',
        method: 'card'
    }
];

// Vouchers
export const mockVouchers = [
    {
        id: 'VC001',
        code: 'WELCOME50',
        name: 'Voucher chào mừng',
        type: 'percent',        // percent, fixed
        value: 10,
        minOrder: 100000,
        maxDiscount: 50000,
        quantity: 100,
        used: 25,
        validFrom: '2026-02-01',
        validTo: '2026-03-01',
        isActive: true
    },
    {
        id: 'VC002',
        code: 'VIP200K',
        name: 'Giảm 200K cho VIP',
        type: 'fixed',
        value: 200000,
        minOrder: 500000,
        maxDiscount: null,
        quantity: 50,
        used: 10,
        validFrom: '2026-01-15',
        validTo: '2026-02-15',
        isActive: true
    }
];

// Wallets
export const mockWallets = [
    {
        id: 1,
        userId: 1,
        userName: 'Nguyễn Văn A',
        userPhone: '0901234567',
        balance: 500000,
        totalDeposit: 2000000,
        totalSpent: 1500000,
        lastTransaction: '2026-02-03',
        status: 'active'
    },
    {
        id: 2,
        userId: 2,
        userName: 'Trần Thị B',
        userPhone: '0907654321',
        balance: 150000,
        totalDeposit: 500000,
        totalSpent: 350000,
        lastTransaction: '2026-02-01',
        status: 'active'
    }
];

// Revenue Reports
export const mockRevenue = {
    daily: [
        { date: '2026-02-01', revenue: 1200000, bookings: 15 },
        { date: '2026-02-02', revenue: 1500000, bookings: 18 },
        { date: '2026-02-03', revenue: 950000, bookings: 12 }
    ],
    monthly: [
        { month: '2026-01', revenue: 35000000, bookings: 420 },
        { month: '2025-12', revenue: 32000000, bookings: 390 }
    ],
    summary: {
        today: 1800000,
        thisWeek: 8500000,
        thisMonth: 15000000,
        lastMonth: 32000000
    }
};

// Transaction Errors
export const mockTransactionErrors = [
    {
        id: 1,
        transactionId: 'TX001',
        type: 'payment_gateway_error',
        bookingId: 'BK011',
        userName: 'User X',
        amount: 120000,
        description: 'Lỗi kết nối cổng thanh toán',
        occurredAt: '2026-02-02 15:30',
        status: 'pending'
    },
    {
        id: 2,
        transactionId: 'TX002',
        type: 'refund_failed',
        bookingId: 'BK012',
        userName: 'User Y',
        amount: 200000,
        description: 'Hoàn tiền thất bại - tài khoản không hợp lệ',
        occurredAt: '2026-02-01 10:00',
        status: 'resolved',
        resolution: 'Đã liên hệ ngân hàng, hoàn tiền thành công'
    }
];
