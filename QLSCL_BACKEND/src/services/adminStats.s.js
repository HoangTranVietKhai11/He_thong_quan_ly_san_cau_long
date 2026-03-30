const db = require('../config/db.config');

const adminStatsService = {
  // 1. Tỷ lệ lấp đầy (Occupancy)
  getOccupancyRate: async (facilityId = null, month = null, year = null) => {
    let bookingsQuery = db('Bookings').whereNotIn('status', ['Cancelled']);
    let courtsQuery = db('Courts');
    
    if (facilityId && facilityId !== '') {
      bookingsQuery = bookingsQuery.whereIn('court_id', function() {
        this.select('id').from('Courts').where('location_id', facilityId);
      });
      courtsQuery = courtsQuery.where('location_id', facilityId);
    }

    const totalCourtsRes = await courtsQuery.count('id as count').first();
    const totalCourts = parseInt(totalCourtsRes.count || totalCourtsRes['count(*)'] || totalCourtsRes['count']) || 1;

    const bookings = await bookingsQuery.select('start_time', 'end_time');
    let totalBookedHours = 0;

    bookings.forEach(b => {
       if (!b.start_time || !b.end_time) return;
       try {
           const start = new Date(`1970-01-01T${b.start_time}`);
           const end = new Date(`1970-01-01T${b.end_time}`);
           const diffHours = (end - start) / (1000 * 60 * 60);
           if (diffHours > 0) totalBookedHours += diffHours;
       } catch (e) {}
    });

    const daysInMonth = 30;
    const maxPossibleHours = totalCourts * 16 * daysInMonth;
    const occupancyRate = maxPossibleHours > 0 ? (totalBookedHours / maxPossibleHours) * 100 : 0;

    return {
      total_booked_hours: parseFloat(totalBookedHours).toFixed(1),
      max_possible_hours: maxPossibleHours,
      occupancy_rate: parseFloat(occupancyRate).toFixed(2)
    };
  },

  // 2. Xu hướng đặt sân (Booking Trends)
  getBookingTrends: async () => {
    try {
      const stats = await db('Bookings')
        .select('status')
        .count('id as count')
        .groupBy('status');
        
      let paymentMethods = [];
      try {
        paymentMethods = await db('Transactions')
          .where('status', 'Success')
          .select('payment_method')
          .sum('amount as total')
          .groupBy('payment_method');
      } catch (e) {
        console.warn('Transactions table check failed:', e.message);
      }

      return { booking_status_breakdown: stats, payment_methods: paymentMethods };
    } catch (error) {
      console.error('Error in getBookingTrends:', error);
      throw error;
    }
  },

  // 3. Phân phối theo giờ (Hourly Distribution)
  getHourlyDistribution: async () => {
    try {
      const bookings = await db('Bookings')
        .whereNotIn('status', ['Cancelled'])
        .select('start_time');
      
      const hourCounts = Array(24).fill(0);
      bookings.forEach(b => {
        if (b.start_time) {
          const hour = parseInt(b.start_time.split(':')[0]);
          if (hour >= 0 && hour < 24) hourCounts[hour]++;
        }
      });
      
      return hourCounts.map((count, hour) => ({ hour, count }));
    } catch (error) {
      throw error;
    }
  },

  // 4. Phân phối theo ngày trong tuần (Weekly Distribution)
  getWeeklyDistribution: async () => {
    try {
      const bookings = await db('Bookings')
        .whereNotIn('status', ['Cancelled'])
        .select('booking_date');
      
      const dayCounts = Array(7).fill(0);
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      bookings.forEach(b => {
        if (b.booking_date) {
          const day = new Date(b.booking_date).getDay();
          dayCounts[day]++;
        }
      });
      
      return dayCounts.map((count, i) => ({ day: dayNames[i], count }));
    } catch (error) {
      throw error;
    }
  },

  // 5. Top khách hàng (Top Customers)
  getTopCustomers: async (limit = 5) => {
    try {
      return await db('Bookings')
        .join('Users', 'Bookings.user_id', 'Users.id')
        .whereNotIn('Bookings.status', ['Cancelled'])
        .select('Users.id', 'Users.username', 'Users.email')
        .count('Bookings.id as booking_count')
        .sum('Bookings.total_price as total_spent')
        .groupBy('Users.id', 'Users.username', 'Users.email')
        .orderBy('booking_count', 'desc')
        .limit(limit);
    } catch (error) {
      throw error;
    }
  },

  // 6. Phát hiện xung đột đặt sân (Conflict Detection)
  getConflicts: async () => {
    try {
      // Find bookings that overlap on the same court/date
      const conflicts = await db.raw(`
        SELECT
          b1.id as booking1_id,
          b2.id as booking2_id,
          b1.court_id,
          c.name as court_name,
          b1.booking_date,
          b1.start_time as booking1_start,
          b1.end_time as booking1_end,
          b2.start_time as booking2_start,
          b2.end_time as booking2_end,
          u1.username as user1,
          u2.username as user2,
          b1.status as status1,
          b2.status as status2
        FROM "Bookings" b1
        JOIN "Bookings" b2 ON b1.court_id = b2.court_id
          AND b1.booking_date = b2.booking_date
          AND b1.id < b2.id
          AND b1.start_time < b2.end_time
          AND b2.start_time < b1.end_time
        JOIN "Courts" c ON b1.court_id = c.id
        JOIN "Users" u1 ON b1.user_id = u1.id
        JOIN "Users" u2 ON b2.user_id = u2.id
        WHERE b1.status NOT IN ('Cancelled') AND b2.status NOT IN ('Cancelled')
        ORDER BY b1.booking_date DESC, b1.court_id
      `);
      return conflicts.rows || conflicts;
    } catch (error) {
      console.error('Conflict detection error:', error);
      throw error;
    }
  },

  // 7. Dự đoán khung giờ vàng (Golden Hour Prediction)
  getPredictedGoldenHours: async (facilityId = null) => {
    try {
      // Lấy tất cả lượt đặt trong 30 ngày qua (không tính dã hủy)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let query = db('Bookings')
        .whereNotIn('status', ['Cancelled'])
        .where('booking_date', '>=', thirtyDaysAgo.toISOString().split('T')[0]);

      if (facilityId && facilityId !== '') {
        query = query.whereIn('court_id', function() {
          this.select('id').from('Courts').where('location_id', facilityId);
        });
      }

      const bookings = await query.select('start_time', 'end_time');
      
      // Tính toán số giờ đặt cho từng khung giờ (0-23)
      const hourlyStats = Array(24).fill(0).map((_, i) => ({ hour: i, totalHours: 0 }));
      
      bookings.forEach(b => {
        if (!b.start_time || !b.end_time) return;
        try {
          const startHr = parseInt(b.start_time.split(':')[0]);
          const endHr = parseInt(b.end_time.split(':')[0]);
          const startMin = parseInt(b.start_time.split(':')[1] || 0);
          const endMin = parseInt(b.end_time.split(':')[1] || 0);
          
          let current = startHr + startMin / 60;
          const end = endHr + endMin / 60;
          
          while (current < end) {
            const h = Math.floor(current);
            if (h >= 0 && h < 24) {
              const remainingInHour = 1 - (current - h);
              const durationInThisHour = Math.min(remainingInHour, end - current);
              hourlyStats[h].totalHours += durationInThisHour;
            }
            current = Math.floor(current + 1);
          }
        } catch (e) {}
      });

      // Lấy tổng số sân để tính tỉ lệ lấp đầy
      let courtsQuery = db('Courts');
      if (facilityId && facilityId !== '') {
        courtsQuery = courtsQuery.where('location_id', facilityId);
      }
      const totalCourtsRes = await courtsQuery.count('id as count').first();
      const totalCourts = parseInt(totalCourtsRes.count || totalCourtsRes['count(*)'] || totalCourtsRes['count']) || 1;

      // Giả định mỗi ngày hoạt động 16 tiếng, trong 30 ngày
      // Tỉ lệ occupancy mỗi khung giờ = (tổng giờ đặt trong khung đó) / (tổng số sân * 30 ngày)
      const recommendations = hourlyStats.map(s => {
        const occupancy = (s.totalHours / (totalCourts * 30)) * 100;
        return {
          hour: s.hour,
          occupancy: parseFloat(occupancy.toFixed(2)),
          isRecommended: occupancy >= 60 // Ngưỡng đề xuất: >60%
        };
      });

      return recommendations.filter(r => r.isRecommended).sort((a, b) => b.occupancy - a.occupancy);
    } catch (error) {
      console.error('Error in getPredictedGoldenHours:', error);
      throw error;
    }
  }
};

module.exports = adminStatsService;
