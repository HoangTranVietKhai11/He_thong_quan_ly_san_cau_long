export const mockBookings = [];
export const BOOKING_STATUS = {
    pending: { label: 'Chờ xác nhận', color: 'warning' },
    confirmed: { label: 'Đã xác nhận', color: 'primary' },
    checked_in: { label: 'Đã check-in', color: 'info' },
    completed: { label: 'Hoàn thành', color: 'success' },
    cancelled: { label: 'Đã hủy', color: 'danger' },
};
export const PAYMENT_STATUS = {
    paid: { label: 'Đã thanh toán', color: 'success' },
    pending: { label: 'Chờ thanh toán', color: 'warning' },
    refunded: { label: 'Đã hoàn tiền', color: 'secondary' },
};
