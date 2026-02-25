import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BiUser, BiBuilding, BiCalendar, BiDollar, BiTrendingUp } from 'react-icons/bi';
import { mockStats } from '../../utils/mockData';

const Dashboard = () => {
    const stats = mockStats.admin;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Dashboard - Quản trị viên</h2>

            <Row className="mb-4">
                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng người dùng</p>
                                    <h2 className="fw-bold mb-0">{stats.totalUsers}</h2>
                                    <small className="text-success">+{stats.newUsersThisMonth} tháng này</small>
                                </div>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiUser size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng sân</p>
                                    <h2 className="fw-bold mb-0">{stats.totalCourts}</h2>
                                </div>
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiBuilding size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Đặt sân hôm nay</p>
                                    <h2 className="fw-bold mb-0">{stats.todayBookings}</h2>
                                    <small className="text-muted">/ {stats.totalBookings} tổng</small>
                                </div>
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiCalendar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Doanh thu tháng</p>
                                    <h3 className="fw-bold mb-0">{formatPrice(stats.monthlyRevenue)}</h3>
                                </div>
                                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiDollar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Biểu đồ doanh thu</h4>
                            <div className="text-center py-5">
                                <BiTrendingUp size={60} className="text-primary mb-3" />
                                <p className="text-muted">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Người dùng hoạt động</h5>
                            <div className="text-center py-3">
                                <h1 className="fw-bold text-primary mb-2">{stats.activeUsers}</h1>
                                <p className="text-muted small mb-0">
                                    Đang hoạt động trong 30 ngày qua
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm bg-success text-white">
                        <Card.Body>
                            <h6 className="fw-bold mb-2">Thống kê nhanh</h6>
                            <p className="small mb-0">
                                Hệ thống đang hoạt động tốt với {stats.activeUsers} người dùng hoạt động.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
