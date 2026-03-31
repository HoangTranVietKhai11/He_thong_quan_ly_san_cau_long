const db = require('./src/config/db.config');

async function listUsers() {
    try {
        const users = await db('Users').select('id', 'username', 'email', 'role');
        console.log('--- User List ---');
        console.table(users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
