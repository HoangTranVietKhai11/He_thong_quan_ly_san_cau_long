const staffOpsService = require('../services/staffOps.s');
const logger = require('../utils/logger');

const getAllEquipments = async (req, res) => {
    try {
        const { location_id } = req.query;
        const equipments = await staffOpsService.getAllEquipments(location_id);
        res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        logger.error('Error in getAllEquipments', error);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách vật tư' });
    }
};

const addEquipment = async (req, res) => {
    try {
        const id = await staffOpsService.addEquipment(req.body);
        res.status(201).json({ success: true, message: 'Thêm vật tư thành công', data: { id } });
    } catch (error) {
        logger.error('Error in addEquipment', error);
        res.status(500).json({ success: false, message: 'Lỗi thêm vật tư' });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await staffOpsService.updateEquipment(id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật vật tư thành công' });
    } catch (error) {
        logger.error('Error in updateEquipment', error);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật vật tư' });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await staffOpsService.deleteEquipment(id);
        res.status(200).json({ success: true, message: 'Xóa vật tư thành công' });
    } catch (error) {
        logger.error('Error in deleteEquipment', error);
        res.status(500).json({ success: false, message: 'Lỗi xóa vật tư' });
    }
};

const getMaintenanceLogs = async (req, res) => {
    try {
        const { court_id } = req.query;
        const logs = await staffOpsService.getMaintenanceLogs(court_id);
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        logger.error('Error in getMaintenanceLogs', error);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách bảo trì' });
    }
};

const addMaintenanceLog = async (req, res) => {
    try {
        const id = await staffOpsService.addMaintenanceLog(req.body);
        res.status(201).json({ success: true, message: 'Đã đưa sân vào diện bảo trì', data: { id } });
    } catch (error) {
        logger.error('Error in addMaintenanceLog', error);
        res.status(500).json({ success: false, message: 'Lỗi thêm lịch bảo trì' });
    }
};

const updateMaintenanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        await staffOpsService.updateMaintenanceStatus(id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật trạng thái bảo trì thành công' });
    } catch (error) {
        logger.error('Error in updateMaintenanceStatus', error);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật bảo trì' });
    }
};

// --- Equipment Rentals ---
const rentEquipment = async (req, res) => {
    try {
        const id = await staffOpsService.rentEquipment(req.body);
        res.status(201).json({ success: true, message: 'Đã tạo phiếu thuê đồ', data: { id } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const returnEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await staffOpsService.returnEquipment(id);
        res.status(200).json({ success: true, message: 'Đã trả đồ thành công' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getRentalsByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const data = await staffOpsService.getRentalsByBooking(booking_id);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Staff Shifts ---
const startShift = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { start_cash, notes } = req.body;
        const result = await staffOpsService.startShift(user_id, start_cash, notes);
        res.status(201).json({ success: true, message: 'Bắt đầu ca làm việc!', data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const endShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { end_cash, notes } = req.body;
        await staffOpsService.endShift(id, end_cash, notes);
        res.status(200).json({ success: true, message: 'Đã kết thúc ca và chốt sổ tiền mặt.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCurrentShift = async (req, res) => {
    try {
        const { user_id } = req.user;
        const shift = await staffOpsService.getCurrentShift(user_id);
        res.status(200).json({ success: true, data: shift });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getMaintenanceLogs,
    addMaintenanceLog,
    updateMaintenanceStatus,
    rentEquipment,
    returnEquipment,
    getRentalsByBooking,
    startShift,
    endShift,
    getCurrentShift
};
