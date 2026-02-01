import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Nav, Form } from 'react-bootstrap';
import { BiCalendar, BiTime, BiMoney, BiCheckCircle, BiXCircle } from 'react-icons/bi';
import { mockBookings } from '../../utils/mockData';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('all');

    const filterBookings = (status) => {
        if (status === 'all') return mockBookings;
        if (status === 'upcoming') return mockBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
        if (status === 'completed') return mockBookings.filter(b => b.status === 'completed');
        return mockBookings.filter(b => b.status === status);
    };

    const filteredBookings = filterBookings(activeTab);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'success',
            pending: 'warning',
            completed: 'info',
            cancelled: 'danger'
        };
        const labels = {
            confirmed: 'Đã xác nhận',
            pending: 'Chờ xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Đặt sân của tôi</h2>
                <Button variant="primary">Đặt sân mới</Button>
            </div>

            {/* Filter Tabs */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Nav variant="pills" className="mb-0">
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'all'}
                                onClick={() => setActiveTab('all')}
                            >
                                Tất cả ({mockBookings.length})
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'upcoming'}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                Sắp tới
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'completed'}
                                onClick={() => setActiveTab('completed')}
                            >
                                Đã hoàn thành
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={activeTab === 'cancelled'}
                                onClick={() => setActiveTab('cancelled')}
                            >
                                Đã hủy
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>

            {/* Bookings List */}
            <Row>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                        <Col key={booking.id} lg={6} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="fw-bold mb-1">{booking.courtName}</h5>
                                            <p className="text-muted small mb-0">
                                                Mã đặt sân: #{booking.id}
                                            </p>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <BiCalendar className="text-primary me-2" />
                                            <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <BiTime className="text-primary me-2" />
                                            <span>{booking.startTime} - {booking.endTime} ({booking.hours} giờ)</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <BiMoney className="text-primary me-2" />
                                            <strong className="text-primary">{formatPrice(booking.totalPrice)}</strong>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {booking.paymentStatus === 'paid' ? (
                                                <>
                                                    <BiCheckCircle className="text-success me-2" />
                                                    <span className="text-success">Đã thanh toán</span>
                                                </>
                                            ) : (
                                                <>
                                                    <BiXCircle className="text-warning me-2" />
                                                    <span className="text-warning">Chưa thanh toán</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm" className="flex-grow-1">
                                            Chi tiết
                                        </Button>
                                        {booking.status === 'pending' && (
                                            <Button variant="outline-danger" size="sm">
                                                Hủy
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center py-5">
                                <BiCalendar size={60} className="text-muted mb-3" />
                                <h5 className="text-muted">Chưa có đặt sân nào</h5>
                                <p className="text-muted mb-4">
                                    Bắt đầu đặt sân cầu lông ngay hôm nay!
                                </p>
                                <Button variant="primary">Đặt sân ngay</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Bookings;
