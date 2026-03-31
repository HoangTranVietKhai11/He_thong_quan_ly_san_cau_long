require('dotenv').config();
console.log('--- ENV CHECK ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS_LENGTH:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
console.log('EMAIL_PASS_QUOTED:', process.env.EMAIL_PASS.startsWith('"'));
process.exit(0);
