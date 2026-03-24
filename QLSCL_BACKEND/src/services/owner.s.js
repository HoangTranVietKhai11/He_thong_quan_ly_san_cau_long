const db = require('../config/db.config');

const ownerService = {
    // Thống kê tổng quan cho Owner (Dữ liệu từ mọi cơ sở)
    getDashboardStats: async () => {
        const totalFacilities = await db('facilities').count('id as count').first();
        const totalCourts = await db('Courts').count('id as count').first();
        const totalUsers = await db('Users').count('id as count').first();
        
        // Tính tổng doanh thu
        const totalRevenue = await db('Bookings')
            .whereIn('status', ['Completed', 'CheckedIn'])
            .sum('total_price as total')
            .first();

        const pendingBookings = await db('Bookings')
            .where('status', 'Pending')
            .count('id as count')
            .first();

        // Doanh thu theo cơ sở
        const revenueByFacility = await db('facilities')
            .leftJoin('Courts', 'facilities.id', 'Courts.location_id')
            .leftJoin('Bookings', 'Courts.id', 'Bookings.court_id')
            .select(
                'facilities.id',
                'facilities.name',
                db.raw('COALESCE(SUM(CASE WHEN Bookings.status IN (\'Completed\', \'CheckedIn\') THEN Bookings.total_price ELSE 0 END), 0) as total_revenue'),
                db.raw('COUNT(Bookings.id) as total_bookings')
            )
            .groupBy('facilities.id', 'facilities.name');

        return {
            overview: {
                total_facilities: parseInt(totalFacilities.count),
                total_courts: parseInt(totalCourts.count),
                total_users: parseInt(totalUsers.count),
                total_revenue: parseInt(totalRevenue.total || 0),
                pending_bookings: parseInt(pendingBookings.count)
            },
            revenue_by_facility: revenueByFacility
        };
    },

    // Quản lý cơ sở (Facilities)
    getAllFacilities: async () => {
        return db('facilities').select('*').orderBy('id', 'asc');
    },

    createFacility: async (data) => {
        const [id] = await db('facilities').insert(data).returning('id');
        return db('facilities').where('id', id.id || id).first();
    },

    updateFacility: async (id, data) => {
        await db('facilities').where({ id }).update({
            ...data,
            updated_at: db.fn.now()
        });
        return db('facilities').where({ id }).first();
    },

    deleteFacility: async (id) => {
        // Kiểm tra xem có sân nào đang thuộc cơ sở này không
        const courtsCount = await db('Courts').where('location_id', id).count('id as count').first();
        if (parseInt(courtsCount.count) > 0) {
            throw new Error('Không thể xóa cơ sở đang có sân hoạt động. Vui lòng chuyển sân sang cơ sở khác trước.');
        }
        return db('facilities').where({ id }).del();
    }
};

module.exports = ownerService;
