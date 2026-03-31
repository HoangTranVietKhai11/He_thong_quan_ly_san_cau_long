const db = require('./src/config/db.config');

async function testQuery() {
    try {
        console.log('--- ĐANG KIỂM TRA TRUY VẤN TÀI CHÍNH ---');
        const bookings = await db('Bookings')
            .join('Courts', 'Bookings.court_id', 'Courts.id')
            .join('Users', 'Bookings.user_id', 'Users.id')
            .select(
                'Bookings.*', 
                'Courts.name as court_name',
                'Users.username as user_name'
            )
            .orderBy('Bookings.created_at', 'desc')
            .limit(5);

        console.log('✅ TRUY VẤN THÀNH CÔNG!');
        console.log('Số lượng đơn tìm thấy:', bookings.length);
        if (bookings.length > 0) {
            console.log('Dữ liệu mẫu đơn đầu tiên:', JSON.stringify(bookings[0], null, 2));
        }
    } catch (error) {
        console.error('❌ LỖI TRUY VẤN SQL:');
        console.error(error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        await db.destroy();
    }
}

testQuery();
