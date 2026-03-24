const checkinService = require('../services/checkin.s');

const getTodayBookings = async (req, res) => {
    try {
        const bookings = await checkinService.getTodayBookings();
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const searchBooking = async (req, res) => {
    try {
        const { query, type } = req.query;
        if (!query) return res.status(400).json({ success: false, message: 'Cần cung cấp query để tìm kiếm!' });
        const results = await checkinService.searchBookingForCheckIn(query, type || 'booking_id');
        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const checkIn = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const staff_id = req.user.user_id;
        const result = await checkinService.checkInBooking(parseInt(booking_id), staff_id);
        return res.status(200).json({ success: true, message: 'Check-in thành công!', data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const extendBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const { extend_minutes } = req.body;
        const staff_id = req.user.user_id;
        if (!extend_minutes) return res.status(400).json({ success: false, message: 'Cần cung cấp extend_minutes!' });
        const result = await checkinService.extendBooking(parseInt(booking_id), parseInt(extend_minutes), staff_id);
        return res.status(200).json({ success: true, message: `Đã gia hạn ${extend_minutes} phút thành công!`, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getTodayBookings, searchBooking, checkIn, extendBooking };
