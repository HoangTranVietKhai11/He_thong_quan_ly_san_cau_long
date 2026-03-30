import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { BiSearch, BiUser, BiLogIn, BiLogOut } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        const role = user.role?.toLowerCase();
        switch (role) {
            case 'admin':
                return '/admin/dashboard';
            case 'owner':
                return '/owner/dashboard';
            case 'staff':
                return '/staff/dashboard';
            default:
                return '/user/dashboard';
        }
    };

    const getProfileLink = () => {
        if (!user) return '/';
        const role = user.role?.toLowerCase();
        switch (role) {
            case 'admin':
                return '/admin/settings';
            case 'owner':
                return '/owner/dashboard'; // Chưa có trang profile riêng cho owner
            case 'staff':
                return '/staff/profile';
            default:
                return '/user/profile';
        }
    };

    return (
        <BSNavbar bg="white" expand="lg" className="navbar-custom shadow-sm">
            <Container>
                <BSNavbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    🏸 BadmintonBook
                </BSNavbar.Brand>

                <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BSNavbar.Collapse id="basic-navbar-nav">
                    <Form className="d-flex mx-auto my-2 my-lg-0" style={{ maxWidth: '400px', width: '100%' }}>
                        <FormControl
                            type="search"
                            placeholder="Tìm sân cầu lông..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-primary">
                            <BiSearch />
                        </Button>
                    </Form>

                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>

                        {isAuthenticated ? (
                            <NavDropdown
                                title={
                                    <span>
                                        <BiUser className="me-1" />
                                        {user?.name || 'Người dùng'}
                                    </span>
                                }
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to={getDashboardLink()}>
                                    Bảng điều khiển
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={getProfileLink()}>
                                    Hồ sơ cá nhân
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <BiLogOut className="me-2" />
                                    Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    <BiLogIn className="me-1" />
                                    Đăng nhập
                                </Nav.Link>
                                <Button as={Link} to="/register" variant="primary" className="ms-2">
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;
