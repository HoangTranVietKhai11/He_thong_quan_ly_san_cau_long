const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.c');
const { verifyToken, isAdmin } = require('../middlewares/auth.m');

// Dashboard thống kê
router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);

// Quản lý người dùng
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUser);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);

module.exports = router;