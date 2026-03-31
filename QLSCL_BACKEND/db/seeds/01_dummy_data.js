const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  console.log('🔄 Đang kiểm tra và cập nhật quyền quản trị...');

  const saltRounds = 10;
  const rawPassword = '123456';
  const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

  // 1. Cập nhật tài khoản 'admin' hiện có lên quyền Admin (Nếu có)
  const existingUser = await knex('Users').where({ username: 'admin' }).first();
  
  if (existingUser) {
    console.log('⚡ Đã tìm thấy tài khoản admin, đang nâng cấp lên Admin...');
    await knex('Users')
      .where({ username: 'admin' })
      .update({ role: 'Admin' });
  } else {
    // 2. Nếu chưa có thì mới chèn mới
    console.log('🆕 Chưa có tài khoản admin, đang tạo mới...');
    await knex('Users').insert({
      username: 'admin',
      email: 'admin@badminton.com',
      password: hashedPassword,
      role: 'Admin',
      wallet_balance: 0
    });
  }

  // 3. Đảm bảo có dữ liệu Sân và Vị trí (Nếu trống)
  const locationCount = await knex('Locations').count('id as count').first();
  if (parseInt(locationCount.count) === 0) {
    const [loc1] = await knex('Locations').insert([
      { name: 'Cơ sở Quận 1 - TT Thể Thao', address: '123 Lê Lợi, Q1, TP.HCM' },
      { name: 'Cơ sở Quận 7 - Premium', address: '456 Nguyễn Văn Linh, Q7, TP.HCM' }
    ]).returning('id');
    
    await knex('Courts').insert([
      { name: 'Sân 1 (Thường)', type: 'Double', location_id: loc1.id || 1, price_per_hour: 80000, status: 'Active' },
      { name: 'Sân 3 (VIP)', type: 'Vip', location_id: loc1.id || 1, price_per_hour: 120000, status: 'Active' }
    ]);
  }

  console.log('✅ Hoàn tất nạp dữ liệu Admin.');
};