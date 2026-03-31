const db = require('../config/db.config');
const pricingService = require('./pricing.s.js');
const waitlistService = require('./waitlist.s.js');
const { sendEmail } = require('./mail.s'); 

// 1. Chức năng Đặt sân (Đã bỏ cọc, thanh toán tại quầy)
const createBooking = async (data) => {
    const { user_id, username, court_id, booking_date, start_time, end_time, voucher_code } = data;

    // Validate không cho đặt ngày quá khứ
    const today = new Date().toISOString().split('T')[0];
    if (booking_date < today) {
        throw new Error('Không thể đặt sân cho ngày đã qua. Vui lòng chọn ngày hôm nay hoặc sau!');
    }

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

            // 3. GỬI EMAIL THÔNG BÁO (Tự động gửi)
            try {
                const user = await trx('Users').where({ id: user_id }).first();
                if (user && user.email) {
                    sendEmail(
                        user.email,
                        `XÁC NHẬN ĐẶT SÂN THÀNH CÔNG: #${newBooking.id}`,
                        `<h1>Cảm ơn bạn đã đặt sân!</h1>
                         <p>Mã đơn đặt sân: <strong>#${newBooking.id}</strong></p>
                         <p>Ngày đặt: <strong>${newBooking.booking_date}</strong></p>
                         <p>Khung giờ: <strong>${newBooking.start_time} - ${newBooking.end_time}</strong></p>
                         <p>Tổng thành tiền: <strong>${Number(newBooking.total_price).toLocaleString('vi-VN')} VND</strong></p>
                         <p>Hãy đến đúng giờ và chúc bạn chơi vui vẻ!</p>`
                    ).catch(err => console.error('Lỗi gửi email đặt sân:', err.message));
                }
            } catch (mailErr) {
                console.warn('Không thể tìm email để gửi:', mailErr.message);
            }

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
        
        // Hoàn tiền nếu khách đã thanh toán
        let refundMsg = '';
        const amountPaid = parseFloat(booking.amount_paid) || 0;
        if (amountPaid > 0) {
            // Cộng tiền vào ví user
            await trx('Users').where({ id: userId }).increment('wallet_balance', amountPaid);
            // Ghi lịch sử hoàn tiền vào Transactions
            try {
                await trx('Transactions').insert({
                    booking_id: bookingId,
                    user_id: userId,
                    amount: amountPaid,
                    type: 'Refund',
                    payment_method: 'Wallet',
                    status: 'Success',
                    description: `Hoàn tiền hủy lịch đặt sân #${bookingId}`
                });
            } catch (e) {
                console.warn('Không thể ghi Transactions (bảng có thể chưa tồn tại):', e.message);
            }
            refundMsg = ` | Đã hoàn ${amountPaid.toLocaleString('vi-VN')} VND vào ví của bạn.`;
        }
        
        // Thông báo hàng chờ (Waitlist)
        const notifyTarget = await waitlistService.checkAndNotify(booking.court_id, booking.booking_date, booking.start_time, booking.end_time);
        let waitlistMsg = '';
        if (notifyTarget) {
            waitlistMsg = ` | Đã thông báo cho 1 khách hàng trong danh sách chờ.`;
        }

        return { message: `Đã hủy lịch đặt sân thành công!${refundMsg}${waitlistMsg}` };
    });
};

// 3b. Admin hủy sân (bỏ qua kiểm tra ownership, có hoàn tiền tự động)
const adminCancelBooking = async (bookingId, reason) => {
    return await db.transaction(async (trx) => {
        const booking = await trx('Bookings').where({ id: bookingId }).first();
        if (!booking) throw new Error('Không tìm thấy lịch đặt!');
        if (booking.status === 'Cancelled') throw new Error('Lịch đặt này đã được hủy trước đó!');

        await trx('Bookings').where({ id: bookingId }).update({ status: 'Cancelled' });

        // Hoàn tiền nếu đã thanh toán
        let refundAmount = 0;
        const amountPaid = parseFloat(booking.amount_paid) || 0;
        if (amountPaid > 0) {
            refundAmount = amountPaid;
            await trx('Users').where({ id: booking.user_id }).increment('wallet_balance', refundAmount);
            try {
                await trx('Transactions').insert({
                    booking_id: bookingId,
                    user_id: booking.user_id,
                    amount: refundAmount,
                    type: 'Refund',
                    payment_method: 'Wallet',
                    status: 'Success',
                    description: `Admin hủy lịch đặt #${bookingId}${reason ? ` - Lý do: ${reason}` : ''}. Hoàn tiền tự động.`
                });
            } catch (e) {
                console.warn('Không ghi được Transactions:', e.message);
            }
        }
        return { message: 'Admin đã hủy thành công!', refundAmount, userId: booking.user_id };
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

// 4b. Đổi lịch trực tiếp (không cần hủy rồi đặt lại)
const rescheduleBooking = async (bookingId, userId, newDate, newStartTime, newEndTime) => {
    return await db.transaction(async (trx) => {
        const booking = await trx('Bookings').where({ id: bookingId, user_id: userId }).first();
        if (!booking) throw new Error('Không tìm thấy lịch đặt hoặc bạn không có quyền đổi!');
        if (booking.status === 'Cancelled') throw new Error('Lịch đặt đã bị hủy, không thể đổi!');
        if (booking.status === 'Fully Paid') throw new Error('Lịch đã thanh toán đầy đủ, không thể đổi lịch. Vui lòng liên hệ nhân viên!');

        // Kiểm tra ngày mới không phải quá khứ
        const today = new Date().toISOString().split('T')[0];
        if (newDate < today) throw new Error('Không thể đổi sang ngày đã qua!');

        // Kiểm tra slot mới có trống không
        const conflict = await trx('Bookings')
            .where({ court_id: booking.court_id, booking_date: newDate })
            .whereNot('id', bookingId)
            .whereNot('status', 'Cancelled')
            .where(function() {
                this.where('start_time', '<', newEndTime).andWhere('end_time', '>', newStartTime);
            })
            .first();
        if (conflict) throw new Error('Khung giờ mới đã có người đặt! Vui lòng chọn giờ khác.');

        // Tính lại giá cho khung giờ mới
        const court = await trx('Courts').where({ id: booking.court_id }).first();
        const startH = parseInt(newStartTime.split(':')[0]);
        const endH = parseInt(newEndTime.split(':')[0]);
        const hours = endH - startH;
        const newPrice = Math.round(hours * parseFloat(court.price_per_hour));

        await trx('Bookings').where({ id: bookingId }).update({
            booking_date: newDate,
            start_time: newStartTime,
            end_time: newEndTime,
            total_price: newPrice,
            balance_due: newPrice,
            status: 'Confirmed'
        });

        return { message: `Đổi lịch thành công sang ${newDate} lúc ${newStartTime}!`, newPrice };
    });
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
                type: 'Payment',
                payment_method: 'Cash',
                status: 'Success',
                description: `Thu tiền tại quầy bởi nhân viên #${staffId}`
            });
        } catch (e) {
            console.warn('Could not insert into Transactions (table may not exist):', e.message);
        }

        return { message: `Đã xác nhận thanh toán ${booking.total_price.toLocaleString('vi-VN')} VND!` };
    });
};

// 8. Lấy toàn bộ lịch đặt sân (Cho Admin)
const getAllBookings = async (filters = {}) => {
    let query = db('Bookings')
        .join('Courts', 'Bookings.court_id', 'Courts.id')
        .join('Users', 'Bookings.user_id', 'Users.id')
        .select(
            'Bookings.*', 
            'Courts.name as court_name',
            'Users.username as user_name'
        )
        .orderBy('Bookings.created_at', 'desc');

    if (filters.status && filters.status !== 'all') {
        query = query.where('Bookings.status', filters.status);
    }
    
    return await query;
};

// 9. Lấy chi tiết lịch đặt sân theo ID
const getBookingById = async (bookingId, userId, role) => {
    let query = db('Bookings')
        .join('Courts', 'Bookings.court_id', 'Courts.id')
        .join('Users', 'Bookings.user_id', 'Users.id')
        .select(
            'Bookings.*', 
            'Courts.name as court_name',
            'Users.username as user_name'
        )
        .where('Bookings.id', bookingId);
        
    // Nếu là user thường, chỉ cho xem lịch đặt của chính họ
    if (role === 'user' || role === 'client') {
        query = query.where('Bookings.user_id', userId);
    }
    
    const booking = await query.first();
    if (!booking) throw new Error('Không tìm thấy thông tin đơn đặt sân hoặc bạn không có quyền truy cập!');
    return booking;
};

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    checkAvailability,
    updateCompletedBookings,
    getBookingsByDate,
    markAsPaid,
    getAllBookings,
    getBookingById,
    rescheduleBooking,
    adminCancelBooking
};