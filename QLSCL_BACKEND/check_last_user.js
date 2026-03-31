const db = require('./src/config/db.config');

async function checkLastUser() {
    try {
        const lastUser = await db('Users').orderBy('created_at', 'desc').first();
        console.log('--- Last Registered User ---');
        console.log(JSON.stringify(lastUser, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLastUser();
