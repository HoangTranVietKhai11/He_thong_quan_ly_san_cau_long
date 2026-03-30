const courtsService = require('../services/courts.s');

// GET /api/courts - Lấy danh sách sân
const getCourts = async (req, res) => {
    try {
        const courts = await courtsService.getAllCourts(req.query);
        return res.status(200).json({ success: true, data: courts });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/courts/:id - Lấy chi tiết sân
const getCourtById = async (req, res) => {
    try {
        const court = await courtsService.getCourtById(req.params.id);
        if (!court) return res.status(404).json({ success: false, message: 'Không tìm thấy sân!' });
        return res.status(200).json({ success: true, data: court });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/courts - Tạo sân mới (Admin)
const createCourt = async (req, res) => {
    try {
        const { name, type, location_id, price_per_hour, status, description, image_url } = req.body;
        if (!name || !price_per_hour || !location_id) {
            return res.status(400).json({ success: false, message: 'Cần cung cấp tên, giá và cơ sở!' });
        }
        const court = await courtsService.createCourt({ name, type, location_id, price_per_hour, status, description, image_url });
        return res.status(201).json({ success: true, message: 'Tạo sân thành công!', data: court });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/courts/:id - Cập nhật sân (Admin)
const updateCourt = async (req, res) => {
    try {
        const court = await courtsService.updateCourt(req.params.id, req.body);
        if (!court) return res.status(404).json({ success: false, message: 'Không tìm thấy sân!' });
        return res.status(200).json({ success: true, message: 'Cập nhật sân thành công!', data: court });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/courts/:id - Xóa sân (Admin)
const deleteCourt = async (req, res) => {
    try {
        await courtsService.deleteCourt(req.params.id);
        return res.status(200).json({ success: true, message: 'Xóa sân thành công!' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getCourts, getCourtById, createCourt, updateCourt, deleteCourt };