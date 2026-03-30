const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/vouchers.c');
const { verifyToken, isAdmin, isStaffOrAdmin } = require('../middlewares/auth.m');

// Public: Áp dụng voucher (User dùng khi đặt sân)
router.post('/apply', verifyToken, voucherController.applyVoucher);

// Staff and Admin: View, Create, Update
router.get('/', verifyToken, isStaffOrAdmin, voucherController.getAllVouchers);
router.post('/', verifyToken, isStaffOrAdmin, voucherController.createVoucher);
router.put('/:id', verifyToken, isStaffOrAdmin, voucherController.updateVoucher);

// Admin only: Delete voucher
router.delete('/:id', verifyToken, isAdmin, voucherController.deleteVoucher);

module.exports = router;
