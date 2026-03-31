require('dotenv').config({ path: './QLSCL_BACKEND/.env' });
const { sendEmail } = require('./QLSCL_BACKEND/src/services/mail.s.js');

async function testEmail() {
    console.log('--- Testing Email Sending ---');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '******' : 'MISSING');
    
    try {
        const result = await sendEmail('hoangtranvietkhai@gmail.com', 'Test Email Connection', '<h1>Đây là thư kiểm tra từ hệ thống</h1>');
        if (result) {
            console.log('Thử nghiệm thành công! Vui lòng kiểm tra hộp thư.');
        } else {
            console.log('Thử nghiệm thất bại (Không ném lỗi nhưng không có kết quả).');
        }
    } catch (err) {
        console.error('Lỗi khi chạy script kiểm tra:', err.message);
    }
    process.exit(0);
}

testEmail();
