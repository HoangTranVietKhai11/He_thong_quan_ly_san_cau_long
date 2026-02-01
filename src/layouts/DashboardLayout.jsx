import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../utils/constants';
import * as Icons from 'react-icons/bi';

const DashboardLayout = ({ role }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = NAV_ITEMS[role] || [];

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                {/* User Profile */}
                <div className="text-center p-4 border-bottom border-secondary">
                    <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2"
                        style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <h6 className="mb-0">{user?.name || 'Người dùng'}</h6>
                    <small className="text-muted">{user?.email}</small>
                </div>

                {/* Navigation */}
                <ul className="sidebar-nav mt-3">
                    {navItems.map((item) => {
                        const Icon = Icons[`Bi${item.icon.charAt(0).toUpperCase() + item.icon.slice(1).replace(/-./g, x => x[1].toUpperCase())}`] || Icons.BiCircle;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}

                    <li className="mt-3 border-top border-secondary pt-3">
                        <NavLink to="/" className="sidebar-nav-item">
                            <Icons.BiHome size={20} />
                            <span>Trang chủ</span>
                        </NavLink>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="sidebar-nav-item w-100 border-0 bg-transparent text-start">
                            <Icons.BiLogOut size={20} />
                            <span>Đăng xuất</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="dashboard-content flex-grow-1">
                <Container fluid>
                    <Outlet />
                </Container>
            </div>
        </div>
    );
};

export default DashboardLayout;
