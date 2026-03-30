const db = require('./src/config/db.config');

async function run() {
  try {
    const users = await db('Users').select('id', 'email', 'role', 'password').whereIn('role', ['admin', 'owner']).limit(5);
    console.log("Admin/Owner users found:");
    console.log(users);
  } catch (e) {
    console.error(e);
  } finally {
    db.destroy();
  }
}

run();
