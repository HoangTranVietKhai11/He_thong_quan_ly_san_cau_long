import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BiCalendar, BiCheckCircle, BiDollar, BiTrendingUp } from 'react-icons/bi';
import { mockStats, mockBookings } from '../../utils/mockData';

const Dashboard = () => {
    const stats = mockStats.user;
    const upcomingBookings = mockBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Dashboard - Người dùng</h2>

            {/* Stats Cards */}
            <Row className="mb-4">
                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng đặt sân</p>
                                    <h2 className="fw-bold mb-0">{stats.totalBookings}</h2>
                                </div>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
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
                                    <p className="text-muted mb-1">Đặt sân sắp tới</p>
                                    <h2 className="fw-bold mb-0">{stats.upcomingBookings}</h2>
                                </div>
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiTrendingUp size={30} />
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
                                    <p className="text-muted mb-1">Đã hoàn thành</p>
                                    <h2 className="fw-bold mb-0">{stats.completedBookings}</h2>
                                </div>
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiCheckCircle size={30} />
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
                                    <p className="text-muted mb-1">Tổng chi tiêu</p>
                                    <h3 className="fw-bold mb-0">{formatPrice(stats.totalSpent)}</h3>
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

            {/* Upcoming Bookings */}
            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Đặt sân sắp tới</h4>
                            {upcomingBookings.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Sân</th>
                                                <th>Ngày</th>
                                                <th>Giờ</th>
                                                <th>Giá</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingBookings.map(booking => (
                                                <tr key={booking.id}>
                                                    <td>{booking.courtName}</td>
                                                    <td>{new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                                                    <td>{booking.startTime} - {booking.endTime}</td>
                                                    <td>{formatPrice(booking.totalPrice)}</td>
                                                    <td>
                                                        <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                                                            {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted text-center py-4">Chưa có đặt sân nào sắp tới</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Sân yêu thích</h5>
                            <div className="text-center py-3">
                                <BiCalendar size={50} className="text-primary mb-3" />
                                <h6 className="fw-bold">{stats.favoriteCourt}</h6>
                                <p className="text-muted small mb-0">
                                    Bạn đã đặt sân này nhiều nhất
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Mẹo hữu ích</h5>
                            <p className="small mb-0">
                                💡 Đặt sân trước 24 giờ để được giá tốt nhất và đảm bảo có chỗ!
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
