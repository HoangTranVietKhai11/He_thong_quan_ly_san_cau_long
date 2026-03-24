import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // 🔓 DEVELOPMENT MODE: Bypass authentication
    // TODO: Set to true only for local UI development without backend
    const DEV_MODE_BYPASS_AUTH = false;

    if (DEV_MODE_BYPASS_AUTH) {
        return children;
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check - normalize to case-insensitive
    const normalizedUserRole = user?.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedUserRole)) {
        console.warn(`Access denied: User role "${user?.role}" not in allowed roles:`, allowedRoles);
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
