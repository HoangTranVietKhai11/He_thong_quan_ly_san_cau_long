require('dotenv').config();
const app = require('./app');
const db = require('./config/db.config');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/`);
    
    try {
        await db.raw('SELECT 1');
        console.log('✅ HỆ THỐNG ĐÃ KẾT NỐI DATABASE THÀNH CÔNG!');
    } catch (err) {
        console.error('❌ LỖI KẾT NỐI DATABASE:', err.message);
        console.error('Hãy kiểm tra biến DATABASE_URL trên Render.');
    }
});