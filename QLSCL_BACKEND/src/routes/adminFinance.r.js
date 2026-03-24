const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminFinance.c');
const { verifyToken, isAdmin } = require('../middlewares/auth.m');

// Mọi route dưới đây đều yêu cầu là Admin
router.use(verifyToken, isAdmin);

// Quản lý Ví
router.get('/wallets', controller.getAllWallets);
router.post('/wallets/topup', controller.topUpWallet);

// Quản lý Giao dịch
router.get('/transactions', controller.getAllTransactions);

// Theo dõi cọc
router.get('/deposits', controller.getDeposits);

module.exports = router;
