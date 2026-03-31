const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookings.c');
const authMiddleware = require('../middlewares/auth.m');

// 1. Tuyến đường dành cho Admin & Staff
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, bookingController.getAllBookings);
router.post('/mark-paid/:booking_id', authMiddleware.verifyToken, authMiddleware.isStaffOrAdmin, bookingController.markAsPaid);
router.put('/admin-cancel/:booking_id', authMiddleware.verifyToken, authMiddleware.isAdmin, bookingController.adminCancelBooking);

// 2. Tuyến đường dành cho Người dùng xác nhận thanh toán
router.put('/confirm-payment/:booking_id', authMiddleware.verifyToken, bookingController.confirmPaymentRequest);

// 3. Tuyến đường nghiệp vụ chung
router.get('/available', bookingController.checkAvailability);
router.get('/mine', authMiddleware.verifyToken, bookingController.getUserBookings);
router.post('/', authMiddleware.verifyToken, bookingController.bookCourt);
router.put('/cancel/:booking_id', authMiddleware.verifyToken, bookingController.cancelBooking);
router.put('/reschedule/:booking_id', authMiddleware.verifyToken, bookingController.rescheduleBooking);
router.get('/by-date', authMiddleware.verifyToken, bookingController.getBookingsByDate);
router.get('/:booking_id', authMiddleware.verifyToken, bookingController.getBookingById);

module.exports = router;