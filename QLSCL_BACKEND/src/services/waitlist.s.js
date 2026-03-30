const knex = require('../config/db.config');

const waitlistService = {
    async addToWaitlist(data) {
        const { user_id, court_id, booking_date, start_time, end_time } = data;
        
        // Basic validation: user can't wait for same slot twice
        const existing = await knex('Waitlist')
            .where({ user_id, court_id, booking_date, start_time, end_time, status: 'Waiting' })
            .first();
        if (existing) throw new Error('Bạn đã nằm trong danh sách chờ của khung giờ này rồi!');

        return knex('Waitlist').insert({
            user_id,
            court_id,
            booking_date,
            start_time,
            end_time,
            status: 'Waiting'
        }).returning('*');
    },

    async getWaitlistByUser(user_id) {
        return knex('Waitlist as w')
            .join('Courts as c', 'w.court_id', 'c.id')
            .where('w.user_id', user_id)
            .select('w.*', 'c.name as court_name')
            .orderBy('w.created_at', 'desc');
    },

    async checkAndNotify(court_id, booking_date, start_time, end_time) {
        // Find top user in waitlist for this slot
        const candidate = await knex('Waitlist')
            .where({ court_id, booking_date, start_time, end_time, status: 'Waiting' })
            .orderBy('created_at', 'asc')
            .first();

        if (candidate) {
            // Update status to Notified
            await knex('Waitlist').where('id', candidate.id).update({
                status: 'Notified'
            });

            // In real app, send Email/SMS here.
            // For now, we just return the candidate info for the controller/caller to log.
            return candidate;
        }
        return null;
    },

    async cancelWaitlist(id, user_id) {
        return knex('Waitlist').where({ id, user_id }).update({ status: 'Cancelled' });
    }
};

module.exports = waitlistService;
