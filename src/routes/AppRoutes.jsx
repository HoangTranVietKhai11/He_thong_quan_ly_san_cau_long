import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Public Pages
import Home from '../pages/public/Home';
import Courts from '../pages/public/Courts';
import CourtDetail from '../pages/public/CourtDetail';
import About from '../pages/public/About';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import UserProfile from '../pages/user/Profile';
import UserBookings from '../pages/user/Bookings';
import UserLiveCalendar from '../pages/user/LiveCalendar';
import UserRecurringBooking from '../pages/user/RecurringBooking';
import UserWaitlist from '../pages/user/WaitlistBooking';
import UserVouchers from '../pages/user/Vouchers';
import UserNotifications from '../pages/user/Notifications';

// Staff Pages
import StaffDashboard from '../pages/staff/Dashboard';
import StaffCheckIn from '../pages/staff/CheckIn';
import StaffCourts from '../pages/staff/Courts';
import StaffVouchers from '../pages/staff/Vouchers';
import StaffProfile from '../pages/staff/Profile';
import StaffCounterBooking from '../pages/staff/CounterBooking';
import StaffCounterPayment from '../pages/staff/CounterPayment';
import StaffRepairSchedule from '../pages/staff/RepairSchedule';
import StaffEquipmentInventory from '../pages/staff/EquipmentInventory';
import StaffSecurity from '../pages/staff/Security';

// Owner Pages
import OwnerDashboard from '../pages/owner/Dashboard';
import OwnerCourts from '../pages/owner/Courts';
import OwnerBookings from '../pages/owner/Bookings';
import OwnerRevenue from '../pages/owner/Revenue';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCourts from '../pages/admin/Courts';
import AdminStatistics from '../pages/admin/Statistics';
import AdminSettings from '../pages/admin/Settings';

// Admin - Users Module
import AdminPermissions from '../pages/admin/users/Permissions';
import AdminSystemLogs from '../pages/admin/users/SystemLogs';
import AdminOAuthSettings from '../pages/admin/users/OAuthSettings';
import AdminSecuritySettings from '../pages/admin/users/SecuritySettings';

// Admin - Courts Module
import AdminCourtPricing from '../pages/admin/courts/Pricing';
import AdminCourtMaintenance from '../pages/admin/courts/Maintenance';
import AdminFloorPlan from '../pages/admin/courts/FloorPlan';
import AdminRepairHistory from '../pages/admin/courts/RepairHistory';
import AdminEquipmentAlerts from '../pages/admin/courts/EquipmentAlerts';
import AdminCourtUsageHistory from '../pages/admin/courts/CourtUsageHistory';

// Admin - Bookings Module
import AdminAllBookings from '../pages/admin/bookings/AllBookings';
import AdminBookingConflicts from '../pages/admin/bookings/Conflicts';
import AdminCancellationPolicies from '../pages/admin/bookings/Policies';
import AdminCheckIn from '../pages/admin/bookings/CheckIn';
import AdminBookingErrors from '../pages/admin/bookings/Errors';
import AdminLiveCalendar from '../pages/admin/bookings/LiveCalendar';

// Admin - Finance Module
import AdminDeposits from '../pages/admin/finance/Deposits';
import AdminCounterPayments from '../pages/admin/finance/CounterPayments';
import AdminOvertimeFees from '../pages/admin/finance/OvertimeFees';
import AdminVouchers from '../pages/admin/finance/Vouchers';
import AdminWallets from '../pages/admin/finance/Wallets';
import AdminRevenueReports from '../pages/admin/finance/RevenueReports';
import AdminTransactionErrors from '../pages/admin/finance/TransactionErrors';

// Admin - Statistics Module
import AdminBookingAnalytics from '../pages/admin/statistics/BookingAnalytics';
import AdminOccupancyStats from '../pages/admin/statistics/OccupancyStats';
import AdminCourtPerformance from '../pages/admin/statistics/CourtPerformance';
import AdminReportGenerator from '../pages/admin/statistics/ReportGenerator';

// Error Pages
import NotFound from '../pages/error/NotFound';
import Unauthorized from '../pages/error/Unauthorized';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/courts" element={<Courts />} />
                <Route path="/courts/:id" element={<CourtDetail />} />
                <Route path="/about" element={<About />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={['user', 'User']}>
                        <DashboardLayout role="user" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="bookings" element={<UserBookings />} />
                <Route path="calendar" element={<UserLiveCalendar />} />
                <Route path="recurring" element={<UserRecurringBooking />} />
                <Route path="waitlist" element={<UserWaitlist />} />
                <Route path="vouchers" element={<UserVouchers />} />
                <Route path="notifications" element={<UserNotifications />} />
            </Route>

            {/* Staff Dashboard Routes */}
            <Route
                path="/staff"
                element={
                    <ProtectedRoute allowedRoles={['staff', 'Staff']}>
                        <DashboardLayout role="staff" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="checkin" element={<StaffCheckIn />} />
                <Route path="courts" element={<StaffCourts />} />
                <Route path="vouchers" element={<StaffVouchers />} />
                <Route path="profile" element={<StaffProfile />} />

                {/* New routes */}
                <Route path="booking" element={<StaffCounterBooking />} />
                <Route path="payment" element={<StaffCounterPayment />} />
                <Route path="repairs" element={<StaffRepairSchedule />} />
                <Route path="equipment" element={<StaffEquipmentInventory />} />
                <Route path="security" element={<StaffSecurity />} />
            </Route>

            {/* Owner Dashboard Routes */}
            <Route
                path="/owner"
                element={
                    <ProtectedRoute allowedRoles={['owner', 'Owner']}>
                        <DashboardLayout role="owner" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="courts" element={<OwnerCourts />} />
                <Route path="bookings" element={<OwnerBookings />} />
                <Route path="revenue" element={<OwnerRevenue />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'Admin']}>
                        <DashboardLayout role="admin" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />

                {/* FE-01: Account Management & Security */}
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/permissions" element={<AdminPermissions />} />
                <Route path="users/logs" element={<AdminSystemLogs />} />
                <Route path="users/oauth" element={<AdminOAuthSettings />} />
                <Route path="users/security" element={<AdminSecuritySettings />} />

                {/* FE-02: Court & Infrastructure */}
                <Route path="courts" element={<AdminCourts />} />
                <Route path="courts/pricing" element={<AdminCourtPricing />} />
                <Route path="courts/maintenance" element={<AdminCourtMaintenance />} />
                <Route path="courts/floor-plan" element={<AdminFloorPlan />} />
                <Route path="courts/repairs" element={<AdminRepairHistory />} />
                <Route path="courts/alerts" element={<AdminEquipmentAlerts />} />
                <Route path="courts/history" element={<AdminCourtUsageHistory />} />

                {/* FE-03: Booking Operations */}
                <Route path="bookings" element={<AdminAllBookings />} />
                <Route path="bookings/calendar" element={<AdminLiveCalendar />} />
                <Route path="bookings/conflicts" element={<AdminBookingConflicts />} />
                <Route path="bookings/policies" element={<AdminCancellationPolicies />} />
                <Route path="bookings/checkin" element={<AdminCheckIn />} />
                <Route path="bookings/errors" element={<AdminBookingErrors />} />

                {/* FE-04: Finance & Payment */}
                <Route path="finance/deposits" element={<AdminDeposits />} />
                <Route path="finance/counter" element={<AdminCounterPayments />} />
                <Route path="finance/overtime" element={<AdminOvertimeFees />} />
                <Route path="finance/vouchers" element={<AdminVouchers />} />
                <Route path="finance/wallets" element={<AdminWallets />} />
                <Route path="finance/revenue" element={<AdminRevenueReports />} />
                <Route path="finance/transactions" element={<AdminTransactionErrors />} />

                {/* FE-05: Statistics & Reports */}
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="statistics/bookings" element={<AdminBookingAnalytics />} />
                <Route path="statistics/occupancy" element={<AdminOccupancyStats />} />
                <Route path="statistics/performance" element={<AdminCourtPerformance />} />
                <Route path="statistics/reports" element={<AdminReportGenerator />} />

                <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes >
    );
};

export default AppRoutes;
