const db = require('../config/db.config');

// Check-in một booking
const checkInBooking = async (booking_id, staff_id) => {
    const booking = await db('Bookings').where({ id: booking_id }).first();
    if (!booking) throw new Error('Booking không tồn tại!');
    if (booking.status === 'Cancelled') throw new Error('Booking này đã bị hủy!');

    const existing = await db('CheckIns').where({ booking_id }).first();
    if (existing) throw new Error('Booking này đã được check-in rồi!');

    const now = new Date();
    await db('Bookings').where({ id: booking_id }).update({
        check_in_time: now,
        status: 'Active'
    });

    const [id] = await db('CheckIns').insert({
        booking_id,
        staff_id,
        check_in_time: now
    }).returning('id');

    return db('CheckIns').where({ id }).first();
};

// Lấy danh sách booking cần check-in hôm nay
const getTodayBookings = async () => {
    const today = new Date().toISOString().split('T')[0];
    return db('Bookings as b')
        .join('Users as u', 'b.user_id', 'u.id')
        .join('Courts as c', 'b.court_id', 'c.id')
        .leftJoin('CheckIns as ci', 'b.id', 'ci.booking_id')
        .where('b.booking_date', today)
        .whereNot('b.status', 'Cancelled')
        .select(
            'b.id', 'b.booking_date', 'b.start_time', 'b.end_time',
            'b.status', 'b.total_price', 'b.check_in_time',
            'u.username as user_name', 'u.email as user_email',
            'c.name as court_name', 'c.id as court_id',
            'ci.check_in_time as checked_in_at', 'ci.staff_id'
        )
        .orderBy('b.start_time');
};

// Gia hạn booking (thêm giờ)
const extendBooking = async (booking_id, extend_minutes, staff_id) => {
    const booking = await db('Bookings').where({ id: booking_id }).first();
    if (!booking) throw new Error('Booking không tồn tại!');
    if (booking.status !== 'Active') throw new Error('Chỉ có thể gia hạn booking đang hoạt động!');

    const court = await db('Courts').where({ id: booking.court_id }).first();
    const extend_fee = Math.round((extend_minutes / 60) * court.price_per_hour);

    // Tính giờ kết thúc mới
    const [endH, endM] = booking.end_time.split(':').map(Number);
    const newEndMinutes = endH * 60 + endM + extend_minutes;
    const newEndH = Math.floor(newEndMinutes / 60).toString().padStart(2, '0');
    const newEndM = (newEndMinutes % 60).toString().padStart(2, '0');
    const new_end_time = `${newEndH}:${newEndM}:00`;

    await db('Bookings').where({ id: booking_id }).update({
        end_time: new_end_time,
        actual_end_time: new_end_time,
        extend_minutes: (booking.extend_minutes || 0) + extend_minutes,
        extend_fee: (parseFloat(booking.extend_fee) || 0) + extend_fee,
        total_price: parseFloat(booking.total_price) + extend_fee
    });

    return {
        booking_id,
        new_end_time,
        extend_minutes,
        extend_fee,
        extended_by: staff_id
    };
};

// Tìm kiếm booking để check-in
const searchBookingForCheckIn = async (query, type = 'booking_id') => {
    let baseQuery = db('Bookings as b')
        .join('Users as u', 'b.user_id', 'u.id')
        .join('Courts as c', 'b.court_id', 'c.id')
        .leftJoin('CheckIns as ci', 'b.id', 'ci.booking_id')
        .whereNot('b.status', 'Cancelled')
        .select(
            'b.id', 'b.booking_date', 'b.start_time', 'b.end_time',
            'b.status', 'b.total_price', 'b.check_in_time',
            'u.username as user_name', 'u.email as user_email',
            'c.name as court_name', 'c.id as court_id',
            db.raw('ci.id IS NOT NULL as is_checked_in')
        );

    if (type === 'booking_id') {
        baseQuery = baseQuery.where('b.id', query);
    } else if (type === 'name') {
        baseQuery = baseQuery.whereILike('u.username', `%${query}%`);
    } else if (type === 'email') {
        baseQuery = baseQuery.whereILike('u.email', `%${query}%`);
    }

    return baseQuery.orderBy('b.booking_date', 'desc').limit(20);
};

module.exports = { checkInBooking, getTodayBookings, extendBooking, searchBookingForCheckIn };
