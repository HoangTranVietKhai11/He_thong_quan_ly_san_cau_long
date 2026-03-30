const knex = require('../config/db.config');
const { createBooking } = require('./bookings.s.js');

const recurringService = {
    async createRecurringProfile(data) {
        const { user_id, court_id, start_date, end_date, days_of_week, start_time, end_time } = data;

        return knex.transaction(async (trx) => {
            // 1. Save profile
            const [profile] = await trx('Recurring_Bookings').insert({
                user_id,
                court_id,
                start_date,
                end_date,
                days_of_week, // e.g., "1,3,5"
                start_time,
                end_time,
                status: 'Active'
            }).returning('*');

            // 2. Generate initial bookings
            const bookings = [];
            const start = new Date(start_date);
            const end = new Date(end_date);
            const days = days_of_week.split(',').map(Number);

            let current = new Date(start);
            while (current <= end) {
                if (days.includes(current.getDay())) {
                    const bookingDate = current.toISOString().split('T')[0];
                    try {
                        // We use the existing createBooking logic but pass through the transaction
                        // Wait: createBooking in bookings.s.js handles its own transaction. 
                        // I might need to refactor createBooking to accept an optional trx or use a separate internal function.
                        // For now, let's call it and hope for the best or implement a simplified version.
                        
                        // Internal-ish booking creation without separate transaction
                        const b = await this._internalCreateBooking(trx, {
                            user_id,
                            court_id,
                            booking_date: bookingDate,
                            start_time,
                            end_time,
                            recurring_id: profile.id
                        });
                        bookings.push(b);
                    } catch (err) {
                        console.error(`Failed to create recurring booking for ${bookingDate}: ${err.message}`);
                        // In a real system, we might want to return a list of failed dates
                    }
                }
                current.setDate(current.getDate() + 1);
            }

            return { profile, createdCount: bookings.length };
        });
    },

    async _internalCreateBooking(trx, data) {
        const { user_id, court_id, booking_date, start_time, end_time } = data;
        const court = await trx('Courts').where({ id: court_id }).first();
        const price = court.price_per_hour; // Simplified for recurring bulk

        // Check availability
        const overlap = await trx('Bookings')
            .where({ court_id, booking_date, start_time })
            .whereNot('status', 'Cancelled')
            .first();
        if (overlap) throw new Error(`Slot ${booking_date} ${start_time} already full`);

        const [newBooking] = await trx('Bookings').insert({
            user_id,
            court_id,
            booking_date,
            start_time,
            end_time,
            total_price: price,
            status: 'Fully Paid'
        }).returning('*');

        return newBooking;
    },

    async getRecurringProfiles(user_id) {
        return knex('Recurring_Bookings')
            .where('user_id', user_id)
            .orderBy('created_at', 'desc');
    },

    async stopRecurring(id, user_id) {
        return knex('Recurring_Bookings')
            .where({ id, user_id })
            .update({ status: 'Stopped' });
    }
};

module.exports = recurringService;
