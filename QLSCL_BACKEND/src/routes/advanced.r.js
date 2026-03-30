const express = require('express');
const router = express.Router();
const advancedController = require('../controllers/advanced.c');
const { verifyToken, isAdmin, isStaffOrAdmin } = require('../middlewares/auth.m');

// --- Waitlist ---
router.post('/waitlist', verifyToken, advancedController.addToWaitlist);
router.get('/waitlist/mine', verifyToken, advancedController.getMyWaitlist);

// --- Recurring Bookings ---
router.post('/recurring', verifyToken, advancedController.createRecurringProfile);
router.get('/recurring/mine', verifyToken, advancedController.getMyRecurring);

// --- Dynamic Pricing ---
router.get('/pricing/calculate', verifyToken, advancedController.getDynamicPrice);
router.get('/pricing/rules', verifyToken, advancedController.getAllPricingRules);
router.post('/pricing/rules', verifyToken, advancedController.createPricingRule);

// --- Audit Logs (Admin only) ---
router.get('/logs', verifyToken, isAdmin, advancedController.getAuditLogs);

module.exports = router;
