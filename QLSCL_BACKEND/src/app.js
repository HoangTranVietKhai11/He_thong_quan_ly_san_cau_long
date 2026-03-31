const express = require('express');
const cors = require('cors');
const httpLogger = require('./middlewares/httpLogger.m');
const bookingRoutes = require('./routes/bookings.r');
const authRoutes = require('./routes/auth.r');
const walletRoutes = require('./routes/wallet.r');
const startBookingCronJob = require('./jobs/booking.cron');
const adminRoutes = require('./routes/admin.r');
const checkinRoutes = require('./routes/checkin.r');
const voucherRoutes = require('./routes/vouchers.r');
const ownerRoutes = require('./routes/owner.r');
const adminFinanceRoutes = require('./routes/adminFinance.r');
const adminStatsRoutes = require('./routes/adminStats.r');
const staffOpsRoutes = require('./routes/staffOps.r');
const courtRoutes = require('./routes/courts.r');
const advancedRoutes = require('./routes/advanced.r');

const app = express();

// Cấu hình CORS linh hoạt cho Production
app.use(cors({
  origin: true, // Cho phép tất cả các domain truy cập (Linh hoạt cho việc Deploy)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Khởi chạy cron job
startBookingCronJob();

// Gắn routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin/finance', adminFinanceRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/staff/ops', staffOpsRoutes);
app.use('/api/advanced', advancedRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Quản lý Sân Cầu Lông đang hoạt động!'
  });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});

module.exports = app;