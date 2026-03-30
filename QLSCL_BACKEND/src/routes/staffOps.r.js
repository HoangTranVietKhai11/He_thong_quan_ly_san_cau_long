const express = require('express');
const router = express.Router();
const controller = require('../controllers/staffOps.c');
const { verifyToken, isStaffOrAdmin } = require('../middlewares/auth.m');

// Mọi route ở đây đều yêu cầu quyền Nhân viên hoặc Admin
router.use(verifyToken, isStaffOrAdmin);

// Quản lý Vật tư (Equipments)
router.get('/equipments', controller.getAllEquipments);
router.post('/equipments', controller.addEquipment);
router.put('/equipments/:id', controller.updateEquipment);
router.delete('/equipments/:id', controller.deleteEquipment);

// Quản lý Bảo trì (Maintenance)
router.get('/maintenance', controller.getMaintenanceLogs);
router.post('/maintenance', controller.addMaintenanceLog);
router.put('/maintenance/:id', controller.updateMaintenanceStatus);

// Quản lý Cho thuê (Rentals)
router.post('/rent-equipment', controller.rentEquipment);
router.put('/return-equipment/:id', controller.returnEquipment);
router.get('/rentals/booking/:booking_id', controller.getRentalsByBooking);

// Quản lý Ca làm việc (Shifts)
router.post('/shifts/start', controller.startShift);
router.put('/shifts/end/:id', controller.endShift);
router.get('/shifts/current', controller.getCurrentShift);

module.exports = router;
