const db = require('../config/db.config');
const pricingService = require('./pricing.s.js');
const waitlistService = require('./waitlist.s.js');

// 1. Chức năng Đặt sân (Đã bỏ cọc, thanh toán tại quầy)
const createBooking = async (data) => {
    const { user_id, username, court_id, booking_date, start_time, end_time, voucher_code } = data;

    return await db.transaction(async (trx) => {
        try {
            const court = await trx('Courts').where({ id: court_id, status: 'Active' }).first();
            if (!court) throw new Error('Sân không khả dụng hoặc đang bảo trì!');

            // Tính giá động
            const originalPrice = await pricingService.getPrice(court_id, booking_date, start_time, end_time);

            // Áp dụng voucher nếu có
            let finalPrice = originalPrice;
            let discountAmount = 0;
            let voucherId = null;

            if (voucher_code && voucher_code.trim() !== '') {
                const voucher = await trx('Vouchers').where({ code: voucher_code.trim().toUpperCase() }).first();
                if (!voucher) throw new Error(`Mã voucher "${voucher_code}" không tồn tại!`);
                if (voucher.status !== 'Active') throw new Error('Voucher đã hết hạn hoặc ngừng hoạt động!');
                if (voucher.used_count >= voucher.max_uses) throw new Error('Voucher đã hết lượt sử dụng!');
                if (voucher.expiry_date && new Date(voucher.expiry_date) < new Date()) throw new Error('Voucher đã hết hạn sử dụng!');
                if (originalPrice < voucher.min_order) throw new Error(`Đơn hàng tối thiểu ${Number(voucher.min_order).toLocaleString('vi-VN')} VND để dùng voucher này!`);

                if (voucher.discount_type === 'percent') {
                    discountAmount = Math.round((originalPrice * voucher.value) / 100);
                } else {
                    discountAmount = Math.min(voucher.value, originalPrice);
                }
                finalPrice = originalPrice - discountAmount;
                voucherId = voucher.id;

                // Tăng used_count
                await trx('Vouchers').where({ id: voucher.id }).increment('used_count', 1);
            }

            const [newBooking] = await trx('Bookings').insert({
                user_id,
                court_id,
                booking_date,
                start_time,
                end_time,
                total_price: finalPrice,
                amount_paid: 0,
                balance_due: finalPrice,
                status: 'Confirmed',
                voucher_id: voucherId,
                discount_amount: discountAmount
            }).returning('*');

            return { ...newBooking, original_price: originalPrice, discount_amount: discountAmount };

        } catch (error) {
            if (error.code === '23505') {
                throw new Error(`Rất tiếc, sân này đã được đặt vào khung giờ này rồi. ${username} vui lòng chọn khung giờ hoặc sân khác nhé!`);
            }
            throw error;
        }
    });
};


// 2. Lấy lịch sử đặt sân
const getUserBookings = async (userId) => {
    return await db('Bookings')
        .join('Courts', 'Bookings.court_id', 'Courts.id')
        .where('Bookings.user_id', userId)
        .select('Bookings.*', 'Courts.name as court_name')
        .orderBy('booking_date', 'desc');
};

// 3. Hủy lịch đặt sân (Không còn hoàn tiền vì không cọc)
const cancelBooking = async (bookingId, userId) => {
    return await db.transaction(async (trx) => {
        const booking = await trx('Bookings').where({ id: bookingId, user_id: userId }).first();
        if (!booking) throw new Error('Không tìm thấy lịch đặt hoặc bạn không có quyền hủy!');
        if (booking.status === 'Cancelled') throw new Error('Lịch đặt này đã được hủy trước đó rồi!');

        // Cập nhật trạng thái thành Cancelled
        await trx('Bookings').where({ id: bookingId, user_id: userId }).update({ status: 'Cancelled' });
        
        // Thông báo hàng chờ (Waitlist)
        const notifyTarget = await waitlistService.checkAndNotify(booking.court_id, booking.booking_date, booking.start_time, booking.end_time);
        let waitlistMsg = "";
        if (notifyTarget) {
            waitlistMsg = ` | Đã thông báo cho 1 khách hàng trong danh sách chờ.`;
        }

        return { message: `Đã hủy lịch đặt sân thành công!${waitlistMsg}` };
    });
};

// 4. Kiểm tra sân trống
const checkAvailability = async (date, time) => {
    const booked = await db('Bookings')
        .where({ booking_date: date, start_time: time })
        .whereNot('status', 'Cancelled')
        .pluck('court_id');
    return await db('Courts').where({ status: 'Active' }).whereNotIn('id', booked);
};

// 5. Cập nhật trạng thái tự động 
const updateCompletedBookings = async () => {
    try {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        const updatedRows = await db('Bookings')
            .whereIn('status', ['Confirmed', 'Partially Paid', 'Fully Paid']) 
            .andWhere(function() {
                this.where('booking_date', '<', currentDate)
                    .orWhere(function() {
                        this.where('booking_date', '=', currentDate)
                            .andWhere('end_time', '<', currentTime);
                    });
            })

            .update({ status: 'Active' }); 

        return updatedRows;
    } catch (error) {
        throw error;
    }
};

// 6. Lấy toàn bộ lịch đặt trong ngày (Cho Live Calendar)
const getBookingsByDate = async (date) => {
    return await db('Bookings')
        .join('Users', 'Bookings.user_id', 'Users.id')
        .where('booking_date', date)
        .whereNot('status', 'Cancelled')
        .select('Bookings.*', 'Users.username');
};

// 7. Xác nhận đã nhận tiền mặt (Cho nhân viên)
const markAsPaid = async (bookingId, staffId) => {
    return await db.transaction(async (trx) => {
        const booking = await trx('Bookings').where({ id: bookingId }).first();
        if (!booking) throw new Error('Không tìm thấy lịch đặt!');
        if (booking.status === 'Cancelled') throw new Error('Lịch đặt đã bị hủy!');
        if (booking.amount_paid >= booking.total_price) throw new Error('Lịch đặt này đã được thanh toán đầy đủ!');

        await trx('Bookings').where({ id: bookingId }).update({
            status: 'Fully Paid',
            amount_paid: booking.total_price,
            balance_due: 0
        });

        // Ghi nhận giao dịch vào Transactions
        try {
            await trx('Transactions').insert({
                booking_id: bookingId,
                user_id: booking.user_id,
                amount: booking.total_price,
                payment_method: 'Cash',
                status: 'Success',
                note: `Thu tiền tại quầy bởi nhân viên #${staffId}`
            });
        } catch (e) {
            console.warn('Could not insert into Transactions (table may not exist):', e.message);
        }

        return { message: `Đã xác nhận thanh toán ${booking.total_price.toLocaleString('vi-VN')} VND!` };
    });
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    checkAvailability,
    updateCompletedBookings,
    getBookingsByDate,
    markAsPaid
};