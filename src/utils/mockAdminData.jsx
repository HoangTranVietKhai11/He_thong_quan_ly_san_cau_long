// Essential constants for Admin modules (restored to prevent crashes)

export const ALERT_SEVERITY = {
    low: 'thấp',
    medium: 'trung bình',
    high: 'cao',
    critical: 'nghiêm trọng'
};

export const ALERT_STATUS = {
    pending: 'đang chờ',
    resolved: 'đã xử lý',
    ignored: 'bỏ qua'
};

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

export const MAINTENANCE_STATUS = {
    scheduled: 'Đã lên lịch',
    in_progress: 'Đang thực hiện',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};

// Empty data arrays to replace mock data
export const mockCourts = [];
export const mockBookings = [];
export const mockRevenue = { daily: [], monthly: [], summary: { today: 0, thisWeek: 0, thisMonth: 0, lastMonth: 0 } };
export const mockVouchers = [];
export const mockMaintenanceSchedule = [];
export const mockRepairHistory = [];
export const mockCourtPricing = { timeSlots: [], priceMatrix: {} };
export const mockFloorPlanStatus = [];
export const mockEquipmentAlerts = [];
export const mockCourtUsageHistory = [];
export const mockUsageStats = {};
export const mockCancellationPolicies = [];
export const mockBookingErrors = [];
export const mockBookingConflicts = [];
export const mockCheckIns = [];
