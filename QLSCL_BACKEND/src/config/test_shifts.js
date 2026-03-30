const knex = require('./db.config.js');

async function test() {
    try {
        const shifts = await knex('Staff_Shifts').orderBy('start_time', 'desc');
        console.log("SHIFTS:", JSON.stringify(shifts, null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        knex.destroy();
    }
}
test();
