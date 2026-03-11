import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiSearch, FiClock, FiCheck, FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';
import { BiTrendingUp } from 'react-icons/bi';
import { mockCourts, mockBookings, mockUserVouchers, mockVouchers } from '../../utils/mockData';
import { format } from 'date-fns';

const UserDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchTimeSlot, setSearchTimeSlot] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [recommendedCourts, setRecommendedCourts] = useState([]);
    const [activeVouchers, setActiveVouchers] = useState([]);

    useEffect(() => {
        // Get upcoming bookings
        const upcoming = mockBookings
            .filter(b => b.status === 'confirmed' || b.status === 'pending')
            .slice(0, 2);
        setUpcomingBookings(upcoming);

        // Get available courts at the facility
        const available = mockCourts
            .filter(c => c.status === 'available')
            .slice(0, 3);
        setRecommendedCourts(available);

        // Get active vouchers
        const vouchers = mockUserVouchers
            .filter(uv => uv.status === 'available')
            .map(uv => {
                const voucherDetails = mockVouchers.find(v => v.id === uv.voucherId);
                return { ...uv, ...voucherDetails };
            });
        setActiveVouchers(vouchers);
    }, []);

    const handleAdvancedSearch = () => {
        let results = mockCourts.filter(c => c.status === 'available');
        if (searchType) results = results.filter(c => c.type === searchType);
        // Simulate: on date/time, all available courts are shown
        setSearchResults(results);
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
            {/* Welcome Banner */}
            <div className="welcome-banner mb-4 p-4 rounded-3" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white'
            }}>
                <h2 className="mb-2">👋 Chào mừng trở lại!</h2>
                <p className="mb-0 opacity-90">Sẵn sàng tìm sân cầu lông cho buổi tập hôm nay?</p>
            </div>

            {/* Advanced Court Search - FE-02.7 */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-white border-bottom py-3">
                    <div className="d-flex align-items-center">
                        <FiSearch className="me-2 text-primary" size={20} />
                        <h5 className="mb-0">🔍 Tìm kiếm sân nâng cao</h5>
                    </div>
                </Card.Header>
                <Card.Body className="p-3">
                    <Row className="g-3 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">📅 Ngày đặt</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={searchDate}
                                    onChange={e => setSearchDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">⏰ Khung giờ</Form.Label>
                                <Form.Select value={searchTimeSlot} onChange={e => setSearchTimeSlot(e.target.value)}>
                                    <option value="">-- Chọn khung giờ --</option>
                                    {['06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00',
                                        '10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00',
                                        '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
                                        '20:00 - 21:00', '21:00 - 22:00'].map(ts => (
                                            <option key={ts} value={ts}>{ts}</option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">🏸 Loại sân</Form.Label>
                                <Form.Select value={searchType} onChange={e => setSearchType(e.target.value)}>
                                    <option value="">-- Tất cả loại --</option>
                                    <option value="STANDARD">⚽ Tiêu chuẩn</option>
                                    <option value="VIP">⭐ VIP</option>
                                    <option value="DOUBLE">🎯 Sân đôi</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button variant="primary" className="w-100" onClick={handleAdvancedSearch}>
                                <FiSearch className="me-2" />Tìm kiếm sân
                            </Button>
                        </Col>
                    </Row>

                    {searchResults !== null && (
                        <div className="mt-3">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-3 text-muted">
                                    Không tìm thấy sân phù hợp với yêu cầu
                                </div>
                            ) : (
                                <>
                                    <div className="text-muted small mb-2">
                                        Tìm thấy <strong>{searchResults.length}</strong> sân phù hợp
                                        {searchDate && ` cho ngày ${new Date(searchDate).toLocaleDateString('vi-VN')}`}
                                        {searchTimeSlot && ` • ${searchTimeSlot}`}
                                    </div>
                                    <Row>
                                        {searchResults.map(court => (
                                            <Col md={4} key={court.id} className="mb-2">
                                                <Card className="h-100 border hover-shadow" style={{ cursor: 'pointer' }}>
                                                    <Card.Body className="p-3">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <h6 className="mb-0 fw-bold">{court.courtName}</h6>
                                                            <Badge bg={court.type === 'VIP' ? 'warning' : 'info'} text="dark">
                                                                {court.type === 'VIP' ? '⭐ VIP' : '🏸 Standard'}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-primary fw-bold mb-2">
                                                            {court.pricePerHour.toLocaleString('vi-VN')} ₫/giờ
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <Badge bg="success" className="flex-grow-1 text-center py-2">✅ Sẵn sàng</Badge>
                                                            <Button size="sm" variant="primary" className="flex-grow-1">Đặt ngay</Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Row>
                {/* Main Content */}
                <Col lg={8}>
                    {/* Upcoming Bookings */}
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FiClock className="me-2 text-primary" size={20} />
                                    <h5 className="mb-0">Lịch đặt sắp tới</h5>
                                </div>
                                <Link to="/user/bookings" className="text-decoration-none">
                                    Xem tất cả →
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map(booking => (
                                    <div key={booking.id} className="p-4 border-bottom last-child-no-border">
                                        <Row className="align-items-center">
                                            <Col md={8}>
                                                <div className="d-flex align-items-start mb-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1">{booking.courtName}</h6>
                                                        <div className="text-muted small">
                                                            <FiClock size={14} className="me-1" />
                                                            {booking.date} | {booking.startTime} - {booking.endTime}
                                                        </div>
                                                        <div className="text-muted small">
                                                            Sân số {booking.courtNumber}
                                                        </div>
                                                    </div>
                                                    <div className="ms-2">
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={4} className="text-md-end">
                                                <div className="fw-bold text-primary mb-2">
                                                    {booking.totalPrice.toLocaleString('vi-VN')} ₫
                                                </div>
                                                <Button variant="outline-primary" size="sm">
                                                    Xem chi tiết
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 text-center text-muted">
                                    <FiClock size={48} className="mb-3 opacity-25" />
                                    <p className="mb-0">Chưa có lịch đặt sân nào</p>
                                    <Button variant="primary" size="sm" className="mt-3" as={Link} to="/courts">
                                        Đặt sân ngay
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Available Courts */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <BiTrendingUp className="me-2 text-primary" size={20} />
                                    <h5 className="mb-0">Sân đang sẵn sàng</h5>
                                </div>
                                <Link to="/courts" className="text-decoration-none">
                                    Xem tất cả →
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3">
                            <Row>
                                {recommendedCourts.map(court => (
                                    <Col md={4} key={court.id} className="mb-3">
                                        <Card className="h-100 border hover-shadow">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h5 className="mb-0">{court.courtName}</h5>
                                                    <Badge bg={court.type === 'VIP' ? 'warning' : 'info'} text="dark">
                                                        {court.type === 'VIP' ? 'VIP' : 'Standard'}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    {court.description?.substring(0, 50)}...
                                                </p>
                                                <div className="text-primary fw-bold mb-3">
                                                    {court.pricePerHour.toLocaleString('vi-VN')} ₫/giờ
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Badge bg={court.status === 'available' ? 'success' : 'secondary'} className="flex-grow-1">
                                                        {court.status === 'available' ? 'Sẵn sàng' : 'Đang dùng'}
                                                    </Badge>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="flex-grow-1"
                                                        disabled={court.status !== 'available'}
                                                    >
                                                        {court.status === 'available' ? 'Đặt ngay' : 'Đang dùng'}
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                    {/* Active Vouchers */}
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FiTag className="me-2 text-success" size={20} />
                                    <h6 className="mb-0">Voucher của bạn</h6>
                                </div>
                                <Link to="/user/vouchers" className="text-decoration-none small">
                                    Xem tất cả
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3">
                            {activeVouchers.length > 0 ? (
                                activeVouchers.slice(0, 3).map((voucher, index) => (
                                    <div
                                        key={index}
                                        className="voucher-card mb-3 p-3 border rounded"
                                        style={{
                                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                            borderLeft: '4px solid #f59e0b'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <Badge bg="warning" text="dark" className="mb-2">
                                                    {voucher.code}
                                                </Badge>
                                                <div className="small fw-bold text-dark">
                                                    {voucher.description}
                                                </div>
                                            </div>
                                            <FiTag className="text-warning" size={20} />
                                        </div>
                                        <div className="small text-muted">
                                            HSD: {voucher.expiresAt}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted py-3">
                                    <FiTag size={32} className="mb-2 opacity-25" />
                                    <p className="small mb-0">Chưa có voucher</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <h6 className="mb-3">Thống kê của bạn</h6>
                            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                                    <FiCheck className="text-primary" size={20} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Tổng đặt sân</div>
                                    <div className="fw-bold">12 lượt</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                    <FiDollarSign className="text-success" size={20} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="text-muted small">Tổng chi tiêu</div>
                                    <div className="fw-bold text-success">1,920,000 ₫</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserDashboard;
