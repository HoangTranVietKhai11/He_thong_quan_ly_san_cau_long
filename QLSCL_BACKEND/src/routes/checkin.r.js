const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.c');
const { verifyToken } = require('../middlewares/auth.m');

// Middleware kiểm tra quyền Staff hoặc Admin
const isStaffOrAdmin = (req, res, next) => {
    const role = req.user?.role;
    if (role === 'Staff' || role === 'staff' || role === 'Admin' || role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Yêu cầu quyền Staff hoặc Admin!' });
};

// Lấy danh sách booking hôm nay để check-in
router.get('/today', verifyToken, isStaffOrAdmin, checkinController.getTodayBookings);

// Tìm kiếm booking
router.get('/search', verifyToken, isStaffOrAdmin, checkinController.searchBooking);

// Check-in một booking
router.post('/:booking_id/checkin', verifyToken, isStaffOrAdmin, checkinController.checkIn);

// Gia hạn booking
router.put('/:booking_id/extend', verifyToken, isStaffOrAdmin, checkinController.extendBooking);

module.exports = router;
