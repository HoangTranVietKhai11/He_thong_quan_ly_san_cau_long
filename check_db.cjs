const db = require('./QLSCL_BACKEND/src/config/db.config');

async function checkSchema() {
    try {
        console.log('--- USERS TABLE ---');
        const userCols = await db('Users').columnInfo();
        console.log(JSON.stringify(userCols, null, 2));

        console.log('\n--- BOOKINGS TABLE ---');
        const bookingCols = await db('Bookings').columnInfo();
        console.log(JSON.stringify(bookingCols, null, 2));

        console.log('\n--- CHECKING TABLES ---');
        const tables = await db.raw("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        console.log(JSON.stringify(tables.rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
