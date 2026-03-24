const voucherService = require('../services/vouchers.s');

const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await voucherService.getAllVouchers();
        return res.status(200).json({ success: true, data: vouchers });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const applyVoucher = async (req, res) => {
    try {
        const { code, order_total } = req.body;
        if (!code || !order_total) return res.status(400).json({ success: false, message: 'Cần cung cấp code và order_total!' });
        const result = await voucherService.applyVoucher(code, parseFloat(order_total));
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const createVoucher = async (req, res) => {
    try {
        const { code, discount_type, value, min_order, max_uses, expiry_date } = req.body;
        if (!code || !value) return res.status(400).json({ success: false, message: 'Cần cung cấp code và value!' });
        const voucher = await voucherService.createVoucher({ code, discount_type, value, min_order, max_uses, expiry_date });
        return res.status(201).json({ success: true, message: 'Tạo voucher thành công!', data: voucher });
    } catch (error) {
        return res.status(409).json({ success: false, message: error.message });
    }
};

const updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await voucherService.updateVoucher(id, req.body);
        return res.status(200).json({ success: true, message: 'Cập nhật voucher thành công!', data: voucher });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        await voucherService.deleteVoucher(id);
        return res.status(200).json({ success: true, message: 'Xóa voucher thành công!' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllVouchers, applyVoucher, createVoucher, updateVoucher, deleteVoucher };
