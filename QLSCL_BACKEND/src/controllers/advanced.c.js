const db = require('../config/db.config');
const waitlistService = require('../services/waitlist.s');
const recurringService = require('../services/recurring.s');
const pricingService = require('../services/pricing.s');
const logger = require('../utils/logger');

const advancedController = {
    // --- Waitlist ---
    async addToWaitlist(req, res) {
        try {
            const { user_id } = req.user;
            const result = await waitlistService.addToWaitlist({ ...req.body, user_id });
            res.status(201).json({ success: true, message: 'Đã thêm vào danh sách chờ!', data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getMyWaitlist(req, res) {
        try {
            const { user_id } = req.user;
            const data = await waitlistService.getWaitlistByUser(user_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // --- Recurring ---
    async createRecurringProfile(req, res) {
        try {
            const { user_id } = req.user;
            const result = await recurringService.createRecurringProfile({ ...req.body, user_id });
            res.status(201).json({ 
                success: true, 
                message: `Đã thiết lập lịch định kỳ và tạo ${result.createdCount} đơn đặt sân thành công!`,
                data: result 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getMyRecurring(req, res) {
        try {
            const { user_id } = req.user;
            const data = await recurringService.getRecurringProfiles(user_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // --- Pricing ---
    async getDynamicPrice(req, res) {
        try {
            const { court_id, date, start_time, end_time } = req.query;
            const price = await pricingService.getPrice(court_id, date, start_time, end_time);
            res.status(200).json({ success: true, price });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getAllPricingRules(req, res) {
        try {
            const rules = await pricingService.getAllRules();
            res.status(200).json({ success: true, data: rules });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async createPricingRule(req, res) {
        try {
            const result = await pricingService.createRule(req.body);
            res.status(201).json({ success: true, message: 'Đã tạo quy tắc giá mới', data: result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    // --- Audit Logs ---
    async getAuditLogs(req, res) {
        try {
            const logs = await db('Audit_Logs')
                .leftJoin('Users', 'Audit_Logs.user_id', 'Users.id')
                .select(
                    'Audit_Logs.*',
                    'Users.username',
                    db.raw(`'Audit_Logs.table_name' as resource_type`),
                    db.raw(`CAST("Audit_Logs"."record_id" AS TEXT) as resource_id`)
                )
                .orderBy('Audit_Logs.created_at', 'desc')
                .limit(200);
            res.status(200).json({ success: true, data: logs });
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = advancedController;
