const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // KIỂM TRA: Nếu đã có Admin rồi thì không làm gì cả
  const adminAccount = await knex('Users').where({ role: 'Admin' }).first();
  
  if (adminAccount) {
    console.log('📊 Đã có tài khoản Admin, không cần nạp thêm.');
    return;
  }

  console.log('🔐 Đang cưỡng bức nạp tài khoản Admin chuẩn...');

  // 1. MÃ HÓA MẬT KHẨU
  const saltRounds = 10; 
  const rawPassword = process.env.HASHED_PASSWORD || '123456'; 
  const hashedPassword = await bcrypt.hash(rawPassword, saltRounds); 

  // 2. Chèn tài khoản Admin (Nếu không trùng username/email)
  try {
    await knex('Users').insert([
      { username: 'admin', email: 'admin@badminton.com', password: hashedPassword, role: 'Admin', wallet_balance: 0 }
    ]);
    
    // Nếu bảng Locations trống, nạp thêm cho đủ bộ
    const locationCount = await knex('Locations').count('id as count').first();
    if (parseInt(locationCount.count) === 0) {
      await knex('Locations').insert([
        { name: 'Cơ sở Quận 1 - TT Thể Thao', address: '123 Lê Lợi, Q1, TP.HCM' },
        { name: 'Cơ sở Quận 7 - Premium', address: '456 Nguyễn Văn Linh, Q7, TP.HCM' }
      ]);
      
      await knex('Courts').insert([
        { name: 'Sân 1 (Thường)', type: 'Double', location_id: 1, price_per_hour: 80000, status: 'Active' },
        { name: 'Sân 2 (Thường)', type: 'Double', location_id: 1, price_per_hour: 80000, status: 'Active' },
        { name: 'Sân 3 (VIP)', type: 'Vip', location_id: 1, price_per_hour: 120000, status: 'Active' }
      ]);
    }
  } catch (err) {
    console.error('⚠️ Lỗi nạp Seed (Có thể tài khoản đã tồn tại):', err.message);
  }

  console.log('✅ Hệ thống đã sẵn sàng với tài khoản Admin: admin / 123456');
};