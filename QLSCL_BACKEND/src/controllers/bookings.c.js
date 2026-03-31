const bookingService = require('../services/bookings.s');
const logger = require('../utils/logger');

// 1. Đặt sân
const bookCourt = async (req, res) => {
  try {
    const { user_id, username } = req.user; 
    const { court_id, booking_date, start_time, end_time, voucher_code } = req.body;

    const result = await bookingService.createBooking({
      user_id, username, court_id, booking_date, start_time, end_time, voucher_code: voucher_code || null
    });

    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return res.status(409).json({ success: false, message: error.message });
  }
};

// 2. Tải lịch sử người dùng
const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.user_id; 
    const bookings = await bookingService.getUserBookings(user_id);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Kiểm tra sân trống
const checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.query;
    const courts = await bookingService.checkAvailability(date, time);
    return res.status(200).json({ success: true, data: courts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Hủy sân bởi người dùng
const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params; 
    const { user_id, username } = req.user; 
    const result = await bookingService.cancelBooking(booking_id, user_id);
    logger.info(`User ${username} hủy booking #${booking_id}`);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Xác nhận thu tiền mặt (Admin/Staff duyệt - Dùng để chuyển sang Fully Paid)
const markAsPaid = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { user_id: staffId } = req.user;
    const result = await bookingService.markAsPaid(parseInt(booking_id), staffId);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 6. Người dùng xác nhận đã chuyển khoản (Chỉ chuyển trạng thái sang Chờ xác nhận)
const confirmPaymentRequest = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { user_id } = req.user;
    const result = await bookingService.confirmPaymentRequest(parseInt(booking_id), user_id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 7. Lấy toàn bộ danh sách booking (Admin Dashboard)
const getAllBookings = async (req, res) => {
  try {
    const filters = req.query;
    const bookings = await bookingService.getAllBookings(filters);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Đổi lịch đặt sân
const rescheduleBooking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { booking_id } = req.params;
    const { new_date, new_start_time, new_end_time } = req.body;
    const result = await bookingService.rescheduleBooking(
      parseInt(booking_id), user_id, new_date, new_start_time, new_end_time
    );
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 9. Lấy chi tiết đơn đặt sân
const getBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { user_id, role } = req.user; 
    const booking = await bookingService.getBookingById(parseInt(booking_id), user_id, role);
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 10. Admin hủy đơn đặt sân bất kỳ
const adminCancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { reason } = req.body;
    const result = await bookingService.adminCancelBooking(parseInt(booking_id), reason);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 11. Booking theo ngày (Calendar)
const getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await bookingService.getBookingsByDate(date);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  bookCourt, checkAvailability, getUserBookings, cancelBooking,
  getBookingsByDate, markAsPaid, getAllBookings, getBookingById,
  rescheduleBooking, adminCancelBooking, confirmPaymentRequest
};