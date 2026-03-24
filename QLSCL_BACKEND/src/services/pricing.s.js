const knex = require('../config/db.config');

const pricingService = {
    async getPrice(court_id, booking_date, start_time, end_time) {
        const court = await knex('Courts').where('id', court_id).first();
        if (!court) throw new Error('Court not found');

        const basePrice = court.price_per_hour;
        const dayOfWeek = new Date(booking_date).getDay(); // 0 (Sun) to 6 (Sat)
        
        // Find active rules that apply
        const rules = await knex('Price_Rules')
            .where('is_active', true)
            .where(function() {
                this.where('specific_date', booking_date)
                    .orWhere(function() {
                        this.where('days_of_week', 'like', `%${dayOfWeek}%`)
                            .orWhereNull('days_of_week');
                    });
            })
            .orderBy('priority', 'desc');

        // Logic: Apply the first rule that matches the time slot (if time-based) or just apply multiplier
        let finalMultiplier = 1.0;
        let fixedPrice = null;

        for (const rule of rules) {
            let timeMatch = true;
            if (rule.start_time && rule.end_time) {
                // Simplified overlap check: if the booking starts within rule time or overlaps
                if (start_time < rule.end_time && end_time > rule.start_time) {
                    timeMatch = true;
                } else {
                    timeMatch = false;
                }
            }

            if (timeMatch) {
                if (rule.fixed_price) {
                    fixedPrice = rule.fixed_price;
                    break; // Fixed price rule usually wins if priority is high
                }
                finalMultiplier *= rule.multiplier;
                // If prioritize first rule, we could break. But for now, we compound multipliers or take highest.
                // Let's assume one rule per slot for simplicity in MVP.
                break; 
            }
        }

        const hourlyPrice = fixedPrice ? fixedPrice : (basePrice * finalMultiplier);
        
        // Calculate duration in hours
        const start = new Date(`${booking_date}T${start_time}`);
        const end = new Date(`${booking_date}T${end_time}`);
        const durationHours = (end - start) / (1000 * 60 * 60);

        return Math.round(hourlyPrice * durationHours);
    },

    async getAllRules() {
        return knex('Price_Rules').orderBy('priority', 'desc');
    },

    async createRule(data) {
        return knex('Price_Rules').insert(data).returning('*');
    }
};

module.exports = pricingService;
