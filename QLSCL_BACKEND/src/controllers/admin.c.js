const adminUserService = require('../services/adminUsers.s');
const bookingService = require('../services/bookings.s');
const logger = require('../utils/logger');

const getDashboardStats = async (req, res) => {
    try {
        await bookingService.updateCompletedBookings();
        const stats = await adminUserService.getAdminStats();
        return res.status(200).json({ success: true, message: 'Lấy dữ liệu thống kê thành công', data: stats });
    } catch (error) {
        logger.error(`Lỗi dashboard Admin: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Lỗi khi tải dữ liệu thống kê', debug: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await adminUserService.getAllUsers(req.query);
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await adminUserService.updateUser(id, req.body);
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });
        return res.status(200).json({ success: true, message: 'Cập nhật user thành công!', data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent deleting self
        if (parseInt(id) === req.user.user_id) {
            return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản của chính mình!' });
        }
        await adminUserService.deleteUser(id);
        return res.status(200).json({ success: true, message: 'Xóa user thành công!' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats, getAllUsers, updateUser, deleteUser };