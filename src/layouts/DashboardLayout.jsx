import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../utils/constants';
import * as Icons from 'react-icons/bi';
import CollapsibleMenuItem from '../components/admin/CollapsibleMenuItem';

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
            <div className="dashboard-sidebar" style={{ height: '100vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                {/* User Profile */}
                <div className="text-center p-4 border-bottom border-secondary position-relative">
                    <div 
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2 position-relative shadow-sm hover-overlay"
                        style={{ width: '70px', height: '70px', fontSize: '28px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        title="Thay đổi ảnh đại diện"
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="rounded-circle w-100 h-100" style={{ objectFit: 'cover' }} />
                        ) : (
                            user?.name?.charAt(0)?.toUpperCase() || (role === 'admin' ? 'A' : 'U')
                        )}
                        <div className="position-absolute bottom-0 end-0 bg-white rounded-circle text-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '22px', height: '22px', transform: 'translate(0, 0)' }}>
                            <Icons.BiCamera size={14} />
                        </div>
                    </div>
                    <input type="file" id="avatar-upload" className="d-none" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            alert("Đã chọn ảnh: " + e.target.files[0].name + " (Cần API để lưu lên server thật)");
                        }
                    }} />
                    <h6 className="mb-0 fw-bold">{user?.name || (role === 'admin' ? 'Administrator' : 'Người dùng')}</h6>
                    <small className="text-muted">{user?.email || (role === 'admin' ? 'admin@badminton.com' : '')}</small>
                </div>

                {/* Navigation */}
                <ul className="sidebar-nav mt-3">
                    {navItems.map((item, index) => {
                        // Check if item has submenu
                        if (item.submenu) {
                            return <CollapsibleMenuItem key={index} item={item} />;
                        }

                        // Regular menu item
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
