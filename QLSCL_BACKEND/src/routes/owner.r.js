const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.c');
const { verifyToken } = require('../middlewares/auth.m');

// Chức năng middleware để kiểm tra quyền Owner
const isOwner = (req, res, next) => {
  if (req.user && (req.user.role === 'Owner' || req.user.role === 'owner')) {
    next();
  } else {
    // Fallback: nếu admin được tự xem như owner thì uncomment dòng dưới
    // if (req.user.role === 'Admin' || req.user.role === 'admin') return next();
    return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối! Yêu cầu quyền Chủ sân.' });
  }
};

// Yêu cầu đăng nhập và có quyền Chủ sân cho tất cả API Owner
router.use(verifyToken, isOwner);

// Dashboard & Revenue (Chủ sân)
router.get('/dashboard', ownerController.getDashboardStats);

// Quản lý cơ sở (Facilities)
router.get('/facilities', ownerController.getAllFacilities);
router.post('/facilities', ownerController.createFacility);
router.put('/facilities/:id', ownerController.updateFacility);
router.delete('/facilities/:id', ownerController.deleteFacility);

module.exports = router;
