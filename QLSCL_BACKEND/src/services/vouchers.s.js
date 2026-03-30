const db = require('../config/db.config');

// Lấy tất cả voucher
const getAllVouchers = async () => {
    return db('Vouchers').select('*').orderBy('created_at', 'desc');
};

// Lấy voucher theo code
const getVoucherByCode = async (code) => {
    return db('Vouchers').where({ code: code.toUpperCase() }).first();
};

// Tạo voucher mới
const createVoucher = async (data) => {
    const result = await db('Vouchers').insert({
        code: data.code.toUpperCase(),
        discount_type: data.discount_type || 'percent',
        value: data.value,
        min_order: data.min_order || 0,
        max_uses: data.max_uses || 100,
        expiry_date: data.expiry_date || null,
        status: 'Active'
    }).returning('id');
    const id = Array.isArray(result[0]) ? result[0] : (result[0]?.id || result[0]);
    return db('Vouchers').where({ id }).first();
};


// Cập nhật voucher
const updateVoucher = async (id, data) => {
    await db('Vouchers').where({ id }).update({
        discount_type: data.discount_type,
        value: data.value,
        min_order: data.min_order,
        max_uses: data.max_uses,
        expiry_date: data.expiry_date,
        status: data.status
    });
    return db('Vouchers').where({ id }).first();
};

// Xóa voucher
const deleteVoucher = async (id) => {
    return db('Vouchers').where({ id }).del();
};

// Áp dụng voucher (kiểm tra và tăng used_count)
const applyVoucher = async (code, orderTotal) => {
    const voucher = await getVoucherByCode(code);
    if (!voucher) throw new Error('Voucher không tồn tại!');
    if (voucher.status !== 'Active') throw new Error('Voucher đã hết hạn hoặc ngừng hoạt động!');
    if (voucher.used_count >= voucher.max_uses) throw new Error('Voucher đã hết lượt sử dụng!');
    if (voucher.expiry_date && new Date(voucher.expiry_date) < new Date()) throw new Error('Voucher đã hết hạn sử dụng!');
    if (orderTotal < voucher.min_order) throw new Error(`Đơn hàng tối thiểu ${voucher.min_order.toLocaleString('vi-VN')} VND để dùng voucher này!`);

    let discount = 0;
    if (voucher.discount_type === 'percent') {
        discount = Math.round((orderTotal * voucher.value) / 100);
    } else {
        discount = Math.min(voucher.value, orderTotal);
    }

    // Tăng used_count
    await db('Vouchers').where({ id: voucher.id }).increment('used_count', 1);

    return { voucher, discount, final_price: orderTotal - discount };
};

module.exports = { getAllVouchers, getVoucherByCode, createVoucher, updateVoucher, deleteVoucher, applyVoucher };
