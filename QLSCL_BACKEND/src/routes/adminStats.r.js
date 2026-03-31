const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminStats.c');
const { verifyToken, isAdmin } = require('../middlewares/auth.m');

router.use(verifyToken, isAdmin);

// Báo cáo & Phân tích
router.get('/occupancy', controller.getOccupancy);
router.get('/trends', controller.getTrends);
router.get('/hourly', controller.getHourlyDistribution);
router.get('/weekly', controller.getWeeklyDistribution);
router.get('/top-customers', controller.getTopCustomers);
router.get('/conflicts', controller.getConflicts);
router.get('/predicted-golden-hours', controller.getGoldenHourPredictions);
router.get('/system-overview', controller.getSystemOverview);

module.exports = router;
