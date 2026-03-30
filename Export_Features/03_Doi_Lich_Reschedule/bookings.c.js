const bookingService = require('../services/bookings.s');
const logger = require('../utils/logger'); // Đưa logger lên đầu file

// 1. Đặt sân: Lấy thông tin định danh trực tiếp từ Token
const bookCourt = async (req, res) => {
  try {
    const { user_id, username } = req.user; 
    const { court_id, booking_date, start_time, end_time, voucher_code } = req.body;

    if (!court_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin: Sân, ngày và khung giờ đặt!' 
      });
    }

    const result = await bookingService.createBooking({
      user_id,
      username,
      court_id,
      booking_date,
      start_time,
      end_time,
      voucher_code: voucher_code || null
    });

    const discountApplied = result.discount_amount > 0;
    return res.status(201).json({ 
      success: true, 
      message: discountApplied 
        ? `Đặt sân thành công! Đã áp dụng voucher giảm ${Number(result.discount_amount).toLocaleString('vi-VN')} VND.` 
        : 'Đặt sân thành công!', 
      booking_id: result.id,
      total_price: result.total_price,
      discount_amount: result.discount_amount || 0,
      original_price: result.original_price || result.total_price
    });
  } catch (error) {
    return res.status(409).json({ 
      success: false, 
      message: error.message || 'Lỗi không xác định khi đặt sân'
    });
  }
};

// 2. Xem lịch sử: Route /api/bookings/mine
const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.user_id; 
    const bookings = await bookingService.getUserBookings(user_id);
    
    return res.status(200).json({ 
      success: true, 
      data: bookings 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi tải lịch sử: ' + error.message 
    });
  }
};

// 3. Tìm sân trống: Route /api/bookings/available
const checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Jack ơi, bạn cần cung cấp đủ ngày và giờ để mình tìm sân giúp nhé!' 
      });
    }

    const courts = await bookingService.checkAvailability(date, time);
    return res.status(200).json({ 
      success: true, 
      data: courts 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 4. Hủy sân: Có lưu Log kiểm toán
const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params; 
    const { user_id, username } = req.user; 
    const result = await bookingService.cancelBooking(booking_id, user_id);
    logger.info({
      message: 'Hành động hủy sân được thực hiện',
      action: 'DELETE_BOOKING',
      actor_id: user_id,
      actor_name: username,
      target_booking_id: booking_id,
      time: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Hủy lịch đặt sân thành công!' 
    });

  } catch (error) {
    logger.error({
        message: `Lỗi khi hủy sân: ${error.message}`,
        action: 'DELETE_BOOKING_ERROR',
        actor_id: req.user?.user_id,
        target_booking_id: req.params?.booking_id
    });

    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 5. Lấy toàn bộ booking theo ngày
const getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Thiếu ngày!' });

    const bookings = await bookingService.getBookingsByDate(date);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    logger.error(`Lỗi trong getBookingsByDate: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Xác nhận thu tiền (Staff)
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

// 7. Lấy toàn bộ booking (Admin)
const getAllBookings = async (req, res) => {
  try {
    const filters = req.query;
    const bookings = await bookingService.getAllBookings(filters);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    logger.error(`Lỗi trong getAllBookings: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Đổi lịch trực tiếp
const rescheduleBooking = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { booking_id } = req.params;
    const { new_date, new_start_time, new_end_time } = req.body;

    if (!new_date || !new_start_time || !new_end_time) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp ngày mới, giờ bắt đầu và giờ kết thúc!' });
    }

    const result = await bookingService.rescheduleBooking(
      parseInt(booking_id), user_id, new_date, new_start_time, new_end_time
    );
    return res.status(200).json({ success: true, message: result.message, new_price: result.newPrice });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { user_id, role } = req.user; 
    const booking = await bookingService.getBookingById(parseInt(booking_id), user_id, role || 'user');
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    logger.error(`Lỗi trong getBookingById: ${error.message}`);
    return res.status(404).json({ success: false, message: error.message });
  }
};

// 10. Admin hủy bất kỳ booking nào (không cần kiểm tra ownership)
const adminCancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { reason } = req.body;
    const result = await bookingService.adminCancelBooking(parseInt(booking_id), reason || '');
    logger.info({ message: `Admin hủy booking #${booking_id}`, actor: req.user?.username });
    return res.status(200).json({
      success: true,
      message: result.message,
      refundAmount: result.refundAmount,
      userId: result.userId
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { 
  bookCourt, 
  checkAvailability, 
  getUserBookings, 
  cancelBooking,
  getBookingsByDate,
  markAsPaid,
  getAllBookings,
  getBookingById,
  rescheduleBooking,
  adminCancelBooking
};