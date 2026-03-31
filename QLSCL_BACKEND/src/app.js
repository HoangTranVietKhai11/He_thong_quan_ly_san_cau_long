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
const courtRoutes = require('./routes/courts.r'); // Moved this require to the top
const advancedRoutes = require('./routes/advanced.r'); // Added advancedRoutes require
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, '')) 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // LOG CHẨN ĐOÁN (Chỉ xem trong Render Logs)
    console.log(`🔍 CORS CHECK: Origin=${cleanOrigin}`);
    console.log(`📋 ALLOWED: ${allowedOrigins.join(', ')}`);

    if (allowedOrigins.indexOf(cleanOrigin) === -1 && process.env.NODE_ENV === 'production') {
      console.error(`❌ CORS REJECTED: ${cleanOrigin} is not in allowedOrigins`);
      var msg = `The CORS policy for this site does not allow access from ${cleanOrigin}.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);

// Khởi chạy cron job (hoạt động bình thường trên Render vì là Docker)
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
app.use(httpLogger);

app.get('/', (req, res) => {

  res.status(200).json({
    success: true,
    message: 'Chào mừng đến với API Quản lý Sân Cầu Lông!'
  });
});

app.use((req, res, next) => {
  console.log(`[404 NOT FOUND] Method: ${req.method}, URL: ${req.originalUrl}`);
  res.status(404).json({ success: false, message: 'Đường dẫn API không tồn tại!' });
});

module.exports = app;