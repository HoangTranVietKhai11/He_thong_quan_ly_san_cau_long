const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production!');
}


// 1. Hàm Đăng ký (Đã sửa lỗi Not Iterable cho Postgres)
const registerUser = async (userData) => {
  const { username, email, password, phone } = userData;

  const existingUser = await db('Users').where('email', email).orWhere('username', username).first();
  if (existingUser) {
    throw new Error('Email hoặc Tên đăng nhập đã được sử dụng!');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // SỬA LỖI: Thêm .returning('*') để Postgres trả về mảng, tránh lỗi "not iterable"
  const [newUser] = await db('Users').insert({
    username,
    email,
    password: hashedPassword,
    role: 'User',
    wallet_balance: 0,
    phone: phone || null
  }).returning('*');

  // CHIẾN THUẬT: Tạo token luôn để Frontend có thể tự động đăng nhập sau khi đăng ký
  const payload = {
    user_id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    email: newUser.email,
    phone: newUser.phone || null
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

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

// 2. Hàm Đăng nhập (Hỗ trợ cả Email và Username)
const loginUser = async (identifier, password) => {
  const user = await db('Users')
    .where('email', identifier)
    .orWhere('username', identifier)
    .first();
  
  if (!user) {
    throw new Error('Tài khoản không tồn tại trong hệ thống!');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác!');
  }

  // CHIẾN THUẬT: Đưa username vào payload để Middleware bóc tách được tên
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