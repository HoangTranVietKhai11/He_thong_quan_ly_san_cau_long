const ownerService = require('../services/owner.s');
const logger = require('../utils/logger');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await ownerService.getDashboardStats();
        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        logger.error(`Lỗi owner dashboard: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy dữ liệu thống kê Chủ sân', debug: error.message });
    }
};

const getAllFacilities = async (req, res) => {
    try {
        const facilities = await ownerService.getAllFacilities();
        return res.status(200).json({ success: true, data: facilities });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const createFacility = async (req, res) => {
    try {
        const facility = await ownerService.createFacility(req.body);
        return res.status(201).json({ success: true, message: 'Tạo cơ sở thành công', data: facility });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateFacility = async (req, res) => {
    try {
        const { id } = req.params;
        const facility = await ownerService.updateFacility(id, req.body);
        if (!facility) return res.status(404).json({ success: false, message: 'Không tìm thấy cơ sở' });
        return res.status(200).json({ success: true, message: 'Cập nhật cơ sở thành công', data: facility });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteFacility = async (req, res) => {
    try {
        const { id } = req.params;
        await ownerService.deleteFacility(id);
        return res.status(200).json({ success: true, message: 'Xóa cơ sở thành công' });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility
};
