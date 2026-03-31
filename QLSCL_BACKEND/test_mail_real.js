require('dotenv').config();
const { sendEmail } = require('./src/services/mail.s.js');

async function testEmail() {
    const testTo = 'hoangtranvietkhai@gmail.com'; 
    console.log(`--- Testing Email Sending to ${testTo} ---`);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    
    const startTime = Date.now();
    try {
        const result = await sendEmail(testTo, '[Debug] Kiểm tra gửi mail thực tế', `
            <h1>Tiến trình kiểm tra hệ thống</h1>
            <p>Thư này được gửi lúc: ${new Date().toLocaleString('vi-VN')}</p>
            <p>Nếu bạn nhận được thư này, cấu hình SMTP của bạn hoàn toàn chính xác.</p>
        `);
        
        const duration = Date.now() - startTime;
        if (result) {
            console.log('SUCCESS: Email sent successfully!');
            console.log('Result:', JSON.stringify(result, null, 2));
        } else {
            console.log('FAILED: sendEmail returned null (check console for errors).');
        }
        console.log(`Duration: ${duration}ms`);
    } catch (err) {
        console.error('CRITICAL ERROR:', err.message);
    }
    process.exit(0);
}

testEmail();
