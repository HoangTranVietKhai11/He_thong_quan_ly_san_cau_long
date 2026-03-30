const db = require('../config/db.config');

// Lấy tất cả users
const getAllUsers = async (params = {}) => {
    let query = db('Users').select('id', 'username', 'email', 'role', 'wallet_balance', 'created_at');
    if (params.role) query = query.whereILike('role', params.role);
    if (params.search) {
        query = query.where(function() {
            this.whereILike('username', `%${params.search}%`)
                .orWhereILike('email', `%${params.search}%`);
        });
    }
    return query.orderBy('created_at', 'desc');
};

// Lấy user theo ID
const getUserById = async (id) => {
    return db('Users').where({ id })
        .select('id', 'username', 'email', 'role', 'wallet_balance', 'created_at')
        .first();
};

// Cập nhật user (role, wallet, etc.)
const updateUser = async (id, data) => {
    const allowedFields = {};
    if (data.role) allowedFields.role = data.role;
    if (data.wallet_balance !== undefined) allowedFields.wallet_balance = data.wallet_balance;
    if (data.username) allowedFields.username = data.username;

    if (Object.keys(allowedFields).length === 0) {
        throw new Error('Không có dữ liệu hợp lệ để cập nhật!');
    }

    await db('Users').where({ id }).update(allowedFields);
    return getUserById(id);
};

// Xóa user
const deleteUser = async (id) => {
    return db('Users').where({ id }).del();
};

// Thống kê dashboard admin nâng cao
const getAdminStats = async () => {
    const [totalRevenue] = await db('Bookings')
        .whereNotIn('status', ['Cancelled'])
        .sum('total_price as total');

    const [totalBookings] = await db('Bookings').count('id as count');
    const [activeBookings] = await db('Bookings').where({ status: 'Active' }).count('id as count');
    const [totalUsers] = await db('Users').count('id as count');
    const [totalCourts] = await db('Courts').count('id as count');

    const bookingsByStatus = await db('Bookings')
        .select('status')
        .count('id as count')
        .groupBy('status');

    const revenueByDay = await db('Bookings')
        .whereNotIn('status', ['Cancelled'])
        .select(db.raw('DATE(booking_date) as date'))
        .sum('total_price as revenue')
        .groupBy(db.raw('DATE(booking_date)'))
        .orderBy('date', 'desc')
        .limit(30);

    const topCourts = await db('Bookings as b')
        .join('Courts as c', 'b.court_id', 'c.id')
        .whereNotIn('b.status', ['Cancelled'])
        .select('c.id', 'c.name')
        .count('b.id as bookings')
        .sum('b.total_price as revenue')
        .groupBy('c.id', 'c.name')
        .orderBy('bookings', 'desc')
        .limit(5);

    const recentBookings = await db('Bookings as b')
        .join('Users as u', 'b.user_id', 'u.id')
        .select(
            'b.id',
            'u.username',
            'b.total_price',
            'b.status',
            'b.booking_date',
            'b.start_time'
        )
        .orderBy('b.created_at', 'desc')
        .limit(5);

    return {
        overview: {
            total_revenue: parseInt(totalRevenue?.total) || 0,
            total_bookings: parseInt(totalBookings?.count) || 0,
            active_bookings: parseInt(activeBookings?.count) || 0,
            total_users: parseInt(totalUsers?.count) || 0,
            total_courts: parseInt(totalCourts?.count) || 0,
            currency: 'VND'
        },
        bookings_by_status: bookingsByStatus,
        revenue_by_day: revenueByDay,
        top_courts: topCourts,
        recent_bookings: recentBookings
    };
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getAdminStats };
