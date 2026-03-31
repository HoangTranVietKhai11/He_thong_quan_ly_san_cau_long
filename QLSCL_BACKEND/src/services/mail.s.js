const nodemailer = require('nodemailer');

// Cấu hình transporter
// Cấu hình transporter với khả năng tự động xử lý mật khẩu
const rawPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || '';
const cleanPassword = rawPassword.replace(/\s/g, ''); // Tự động xóa khoảng trắng

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == '465', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Gửi email thông báo
 * @param {string} to - Địa chỉ người nhận
 * @param {string} subject - Tiêu đề
 * @param {string} html - Nội dung HTML
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Hệ Thống Quản Lý Sân Cầu Lông" <no-reply@badminton.com>',
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Đã gửi thư đến ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EMAIL ERROR] Lỗi gửi thư đến ${to}:`, error.message);
        // Không throw error để tránh làm hỏng transaction chính của hệ thống
        return null;
    }
};

module.exports = { sendEmail };
