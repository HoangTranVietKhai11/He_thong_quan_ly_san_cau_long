import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiGrid, FiActivity, FiTag } from 'react-icons/fi';
import { mockStaffStats, mockBookings, mockCheckIns, mockStaffActivities } from '../../utils/mockData';

const StaffDashboard = () => {
    const [stats, setStats] = useState(mockStaffStats);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [recentCheckIns, setRecentCheckIns] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        // Get pending check-ins (confirmed bookings for today)
        const pending = mockBookings
            .filter(b => b.status === 'confirmed' && !mockCheckIns.find(ci => ci.bookingId === b.id))
            .slice(0, 5);
        setPendingBookings(pending);

        // Get recent check-ins
        setRecentCheckIns(mockCheckIns.slice(0, 5));

        // Get recent activities
        setRecentActivities(mockStaffActivities.slice(0, 5));
    }, []);

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'success',
            pending: 'warning',
            completed: 'info'
        };
        const labels = {
            confirmed: 'Đã xác nhận',
            pending: 'Chờ xác nhận',
            completed: 'Hoàn thành'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <div className="mb-4">
                <h3 className="mb-1">👋 Chào buổi sáng, Staff!</h3>
                <p className="text-muted mb-0">
                    Hôm nay: {new Date().toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Stats Row */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100 border-start-primary">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                    <FiCheckCircle className="text-primary" size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Đã Check-in Hôm Nay</div>
                                    <h4 className="mb-0 text-primary">{stats.todayCheckIns}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100 border-start-warning">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                    <FiClock className="text-warning" size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Chờ Check-in</div>
                                    <h4 className="mb-0 text-warning">{stats.pendingCheckIns}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100 border-start-success">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                    <FiGrid className="text-success" size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Sân Hoạt Động</div>
                                    <h4 className="mb-0 text-success">{stats.activeCourts}/{stats.totalCourts}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm h-100 border-start border-start-info">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                    <FiActivity className="text-info" size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Đặt Sân Hôm Nay</div>
                                    <h4 className="mb-0 text-info">{stats.todayBookings}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Left Column - Pending Check-ins */}
                <Col lg={7}>
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FiClock className="me-2 text-warning" size={20} />
                                    <h5 className="mb-0">Cần Check-in</h5>
                                </div>
                                <Link to="/staff/checkin" className="text-decoration-none">
                                    Xem tất cả →
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {pendingBookings.length > 0 ? (
                                <Table responsive className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Khách hàng</th>
                                            <th>Sân</th>
                                            <th>Thời gian</th>
                                            <th>Trạng thái</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingBookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td>#{booking.id}</td>
                                                <td>{booking.userName}</td>
                                                <td>Sân {booking.courtNumber}</td>
                                                <td>
                                                    <small>
                                                        {booking.date}<br />
                                                        {booking.startTime} - {booking.endTime}
                                                    </small>
                                                </td>
                                                <td>{getStatusBadge(booking.status)}</td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        as={Link}
                                                        to="/staff/checkin"
                                                    >
                                                        <FiCheckCircle className="me-1" />
                                                        Check-in
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <div className="p-5 text-center text-muted">
                                    <FiClock size={48} className="mb-3 opacity-25" />
                                    <p className="mb-0">Không có booking cần check-in</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Recent Check-ins */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <FiCheckCircle className="me-2 text-success" size={20} />
                                <h5 className="mb-0">Check-in Gần Đây</h5>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Khách hàng</th>
                                        <th>Sân</th>
                                        <th>Thời gian check-in</th>
                                        <th>Nhân viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCheckIns.map(checkIn => (
                                        <tr key={checkIn.id}>
                                            <td>#{checkIn.bookingId}</td>
                                            <td>{checkIn.customerName}</td>
                                            <td>Sân {checkIn.courtNumber}</td>
                                            <td>
                                                <small>
                                                    {new Date(checkIn.checkInTime).toLocaleString('vi-VN')}
                                                </small>
                                            </td>
                                            <td>
                                                <small className="text-muted">{checkIn.staffName}</small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Quick Actions & Activities */}
                <Col lg={5}>
                    {/* Quick Actions */}
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <h6 className="mb-0">Thao Tác Nhanh</h6>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={4}>
                                    <Button
                                        variant="outline-primary"
                                        className="w-100 py-3"
                                        as={Link}
                                        to="/staff/checkin"
                                    >
                                        <FiCheckCircle size={24} className="d-block mx-auto mb-2" />
                                        <small>Check-in</small>
                                    </Button>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="outline-success"
                                        className="w-100 py-3"
                                        as={Link}
                                        to="/staff/courts"
                                    >
                                        <FiGrid size={24} className="d-block mx-auto mb-2" />
                                        <small>Quản lý sân</small>
                                    </Button>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        variant="outline-warning"
                                        className="w-100 py-3"
                                        as={Link}
                                        to="/staff/vouchers"
                                    >
                                        <FiTag size={24} className="d-block mx-auto mb-2" />
                                        <small>Vouchers</small>
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex align-items-center">
                                <FiActivity className="me-2 text-info" size={20} />
                                <h6 className="mb-0">Hoạt Động Gần Đây</h6>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3">
                            <div className="activity-timeline">
                                {recentActivities.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        className={`activity-item pb-3 ${index !== recentActivities.length - 1 ? 'border-bottom' : ''} mb-3`}
                                    >
                                        <div className="d-flex">
                                            <div className="activity-dot me-3">
                                                <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="small fw-bold">{activity.staffName}</div>
                                                <div className="small text-muted">{activity.description}</div>
                                                <div className="small text-muted">
                                                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StaffDashboard;
