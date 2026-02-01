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
import CourtDetail from '../pages/public/CourtDetail';
import About from '../pages/public/About';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import UserProfile from '../pages/user/Profile';
import UserBookings from '../pages/user/Bookings';
import UserNotifications from '../pages/user/Notifications';

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
                <Route path="/courts/:id" element={<CourtDetail />} />
                <Route path="/about" element={<About />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <DashboardLayout role="user" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="bookings" element={<UserBookings />} />
                <Route path="notifications" element={<UserNotifications />} />
            </Route>

            {/* Owner Dashboard Routes */}
            <Route
                path="/owner"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
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
                    <ProtectedRoute allowedRoles={['admin']}>
                        <DashboardLayout role="admin" />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courts" element={<AdminCourts />} />
                <Route path="statistics" element={<AdminStatistics />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
