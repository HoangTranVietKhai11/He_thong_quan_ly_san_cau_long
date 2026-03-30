const authService = require('../services/auth.s');

const register = async (req, res) => {
  try {
    // Đưa log vào trong này mới chạy được
    console.log("Dữ liệu Register nhận được: ", req.body);

    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ Tên đăng nhập, Email, Mật khẩu và Số điện thoại!' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Địa chỉ Email không hợp lệ!' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
    }

    // Validate username length
    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' });
    }

    // Validate phone số điện thoại VN (10 số, bắt đầu từ 0)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số, bắt đầu từ số 0 (ví dụ: 0912345678).' });
    }

    const result = await authService.registerUser({ username: username.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim() });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    // Nếu vẫn lỗi "not iterable", lỗi nằm ở hàm registerUser trong auth.s.js (thiếu .returning)
    return res.status(409).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log("Dữ liệu Login nhận được: ", req.body);
    const { email, identifier, password } = req.body;
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập Email/Tên đăng nhập và Mật khẩu!' });
    }

    const result = await authService.loginUser(loginId, password);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { 
    register,
    login
};