const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    // Nếu dùng port 587 thì secure: false, nếu dùng port 465 thì secure: true
    secure: process.env.EMAIL_PORT == '465', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
    },
    tls: {
        // Hỗ trợ môi trường Render
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
