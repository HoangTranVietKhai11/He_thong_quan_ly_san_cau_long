const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const { sendEmail } = require('./mail.s'); 

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production!');
}

// 1. Hàm Đăng ký (Gửi Email mừng thành viên mới)
const registerUser = async (userData) => {
  const { username, email, password, phone } = userData;

  const existingUser = await db('Users').where('email', email).orWhere('username', username).first();
  if (existingUser) {
    throw new Error('Email hoặc Tên đăng nhập đã được sử dụng!');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [newUser] = await db('Users').insert({
    username,
    email,
    password: hashedPassword,
    role: 'User',
    wallet_balance: 0,
    phone: phone || null
  }).returning('*');

  const payload = {
    user_id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    email: newUser.email,
    phone: newUser.phone || null
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  // GỬI EMAIL CHÀO MỪNG (Tự động gửi)
  sendEmail(
    newUser.email,
    'Chào mừng bạn đến với Hệ Thống Quản Lý Sân Cầu Lông! 🏸',
    `<h1>Chào mừng ${newUser.username}!</h1>
     <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi.</p>
     <p>Giờ đây bạn đã có thể bắt đầu đặt sân và trải nghiệm dịch vụ của chúng tôi.</p>`
  ).catch(err => console.error('Lỗi gửi email chào mừng:', err.message));

  return {
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      wallet_balance: newUser.wallet_balance,
      phone: newUser.phone || null
    }
  };
};

// 2. Hàm Đăng nhập
const loginUser = async (identifier, password) => {
  const user = await db('Users')
    .where('email', identifier)
    .orWhere('username', identifier)
    .first();
  
  if (!user) {
    throw new Error('Tài khoản không tồn tại!');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác!');
  }

  const payload = {
    user_id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    phone: user.phone || null
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      wallet_balance: user.wallet_balance,
      phone: user.phone || null
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};