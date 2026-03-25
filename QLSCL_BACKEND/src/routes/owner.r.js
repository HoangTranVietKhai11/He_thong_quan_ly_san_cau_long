const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.c');
const { verifyToken, isAdmin } = require('../middlewares/auth.m');

// Thống kê dashboard cho chủ sân
router.get('/stats', verifyToken, isAdmin, ownerController.getDashboardStats);

// Quản lý cơ sở (Facilities)
router.get('/facilities', verifyToken, isAdmin, ownerController.getAllFacilities);
router.post('/facilities', verifyToken, isAdmin, ownerController.createFacility);
router.put('/facilities/:id', verifyToken, isAdmin, ownerController.updateFacility);
router.delete('/facilities/:id', verifyToken, isAdmin, ownerController.deleteFacility);

module.exports = router;
