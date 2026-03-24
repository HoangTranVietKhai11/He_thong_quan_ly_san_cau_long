const knex = require('../config/db.config');

const staffOpsService = {
    // --- Equipments (Inventory) ---
    async getAllEquipments(facility_id) {
        let query = knex('Equipments');
        if (facility_id) {
            query = query.where('facility_id', facility_id);
        }
        return query.select('*').orderBy('updated_at', 'desc');
    },

    async addEquipment(data) {
        const [id] = await knex('Equipments').insert({
            name: data.name,
            type: data.type || 'Other',
            price: data.price || 0,
            stock: data.stock || 0,
            facility_id: data.facility_id || 1 // fallback to default facility 1
        }).returning('id');
        return id;
    },

    async updateEquipment(id, data) {
        return knex('Equipments').where('id', id).update({
            name: data.name,
            type: data.type,
            price: data.price,
            stock: data.stock,
            updated_at: knex.fn.now()
        });
    },

    async deleteEquipment(id) {
        return knex('Equipments').where('id', id).del();
    },

    // --- Maintenance ---
    async getMaintenanceLogs(court_id) {
        let query = knex('Maintenance_Logs as m')
            .join('Courts as c', 'm.court_id', 'c.id')
            .select('m.*', 'c.name as court_name');
        
        if (court_id) {
            query = query.where('m.court_id', court_id);
        }
        return query.orderBy('m.created_at', 'desc');
    },

    async addMaintenanceLog(data) {
        return knex.transaction(async (trx) => {
            // Add log
            const [id] = await trx('Maintenance_Logs').insert({
                court_id: data.court_id,
                issue: data.issue,
                status: 'In Progress',
                scheduled_date: data.scheduled_date || new Date().toISOString().split('T')[0]
            }).returning('id');

            // Update court status
            await trx('Courts').where('id', data.court_id).update({
                is_maintenance: true,
                maintenance_note: data.issue
            });

            return id;
        });
    },

    async updateMaintenanceStatus(id, data) {
        return knex.transaction(async (trx) => {
            await trx('Maintenance_Logs').where('id', id).update({
                status: data.status,
                action_taken: data.action_taken,
                completed_date: data.status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
                cost: data.cost || 0
            });

            if (data.status === 'Completed') {
                const log = await trx('Maintenance_Logs').where('id', id).first();
                await trx('Courts').where('id', log.court_id).update({
                    is_maintenance: false,
                    maintenance_note: null
                });
            }
        });
    },

    // --- Equipment Rentals ---
    async rentEquipment(data) {
        return knex.transaction(async (trx) => {
            const equipment = await trx('Equipments').where('id', data.equipment_id).first();
            if (!equipment || equipment.stock < data.quantity) {
                throw new Error('Không đủ hàng trong kho!');
            }

            // Record rental
            const [id] = await trx('Equipment_Rentals').insert({
                booking_id: data.booking_id,
                equipment_id: data.equipment_id,
                quantity: data.quantity,
                price_at_rental: equipment.price,
                status: 'Renting'
            }).returning('id');

            // Decrement stock
            await trx('Equipments').where('id', data.equipment_id).decrement('stock', data.quantity);

            return id;
        });
    },

    async returnEquipment(rental_id) {
        return knex.transaction(async (trx) => {
            const rental = await trx('Equipment_Rentals').where('id', rental_id).first();
            if (!rental || rental.status === 'Returned') return;

            // Mark as returned
            await trx('Equipment_Rentals').where('id', rental_id).update({ status: 'Returned' });

            // Increment stock back
            await trx('Equipments').where('id', rental.equipment_id).increment('stock', rental.quantity);
        });
    },

    async getRentalsByBooking(booking_id) {
        return knex('Equipment_Rentals as r')
            .join('Equipments as e', 'r.equipment_id', 'e.id')
            .where('r.booking_id', booking_id)
            .select('r.*', 'e.name as equipment_name');
    },

    // --- Staff Shifts ---
    async startShift(staff_id, start_cash, notes) {
        return knex('Staff_Shifts').insert({
            staff_id,
            start_cash,
            notes,
            status: 'Open'
        }).returning('*');
    },

    async endShift(shift_id, end_cash, notes) {
        return knex('Staff_Shifts').where('id', shift_id).update({
            end_cash,
            notes: knex.raw('?? || ?', ['notes', ` | Kết ca: ${notes}`]),
            end_time: knex.fn.now(),
            status: 'Closed'
        });
    },

    async getCurrentShift(staff_id) {
        return knex('Staff_Shifts')
            .where({ staff_id, status: 'Open' })
            .first();
    }
};

module.exports = staffOpsService;
