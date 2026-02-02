import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { FiSearch, FiCheckCircle, FiX, FiClock, FiUser, FiPhone, FiDollarSign, FiPrinter } from 'react-icons/fi';
import { mockBookings, mockCheckIns, mockUsers } from '../../utils/mockData';

const CheckIn = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('booking_id'); // booking_id, name, phone, court
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [recentCheckIns, setRecentCheckIns] = useState(mockCheckIns.slice(0, 3));

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        let results = [];
        const query = searchQuery.toLowerCase();

        switch (searchType) {
            case 'booking_id':
                results = mockBookings.filter(b =>
                    b.id.toString() === searchQuery
                );
                break;
            case 'name':
                results = mockBookings.filter(b =>
                    b.userName.toLowerCase().includes(query)
                );
                break;
            case 'phone':
                const user = mockUsers.find(u => u.phone.includes(searchQuery));
                if (user) {
                    results = mockBookings.filter(b => b.userId === user.id);
                }
                break;
            case 'court':
                results = mockBookings.filter(b =>
                    b.courtNumber.toString() === searchQuery
                );
                break;
            default:
                results = [];
        }

        // Filter out already checked-in bookings
        results = results.filter(b =>
            !mockCheckIns.find(ci => ci.bookingId === b.id)
        );

        setSearchResults(results);
        if (results.length === 1) {
            setSelectedBooking(results[0]);
        }
    };

    const handleCheckIn = (booking) => {
        setSelectedBooking(booking);
        setShowConfirmModal(true);
    };

    const confirmCheckIn = () => {
        // Simulate check-in
        const newCheckIn = {
            id: recentCheckIns.length + 1,
            bookingId: selectedBooking.id,
            customerId: selectedBooking.userId,
            customerName: selectedBooking.userName,
            checkInTime: new Date().toISOString(),
            staffId: 5,
            staffName: 'Trần Văn Staff',
            courtNumber: selectedBooking.courtNumber,
            notes: ''
        };

        setRecentCheckIns([newCheckIn, ...recentCheckIns]);
        setCheckInSuccess(true);
        setShowConfirmModal(false);
        setSearchResults(searchResults.filter(b => b.id !== selectedBooking.id));
        setSelectedBooking(null);
        setSearchQuery('');

        // Hide success message after 3 seconds
        setTimeout(() => setCheckInSuccess(false), 3000);
    };

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

    const getPaymentBadge = (status) => {
        return status === 'paid'
            ? <Badge bg="success">Đã thanh toán</Badge>
            : <Badge bg="warning">Chưa thanh toán</Badge>;
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        <FiCheckCircle className="me-2 text-primary" />
                        Check-in Khách Hàng
                    </h3>
                    <p className="text-muted mb-0">Tìm kiếm và check-in booking</p>
                </div>
            </div>

            {/* Success Alert */}
            {checkInSuccess && (
                <Alert variant="success" dismissible onClose={() => setCheckInSuccess(false)}>
                    <FiCheckCircle className="me-2" />
                    Check-in thành công!
                </Alert>
            )}

            {/* Search Section */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3 mb-md-0">
                                <Form.Label>Tìm kiếm theo</Form.Label>
                                <Form.Select
                                    value={searchType}
                                    onChange={(e) => {
                                        setSearchType(e.target.value);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                >
                                    <option value="booking_id">Mã đặt sân</option>
                                    <option value="name">Tên khách hàng</option>
                                    <option value="phone">Số điện thoại</option>
                                    <option value="court">Số sân</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={9}>
                            <Form.Group>
                                <Form.Label>
                                    {searchType === 'booking_id' && 'Nhập mã đặt sân'}
                                    {searchType === 'name' && 'Nhập tên khách hàng'}
                                    {searchType === 'phone' && 'Nhập số điện thoại'}
                                    {searchType === 'court' && 'Nhập số sân'}
                                </Form.Label>
                                <InputGroup size="lg">
                                    <InputGroup.Text className="bg-light">
                                        <FiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder={
                                            searchType === 'booking_id' ? 'VD: 1, 2, 3...' :
                                                searchType === 'name' ? 'VD: Nguyễn Văn A' :
                                                    searchType === 'phone' ? 'VD: 0901234567' :
                                                        'VD: 1, 2, 3...'
                                        }
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <Button variant="primary" onClick={handleSearch}>
                                        <FiSearch className="me-2" />
                                        Tìm kiếm
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                {/* Search Results */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white border-bottom py-3">
                            <h5 className="mb-0">
                                Kết quả tìm kiếm
                                {searchResults.length > 0 && (
                                    <Badge bg="primary" className="ms-2">{searchResults.length}</Badge>
                                )}
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {searchResults.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <FiSearch size={48} className="mb-3 opacity-25" />
                                    <p className="mb-0">
                                        {searchQuery ? 'Không tìm thấy booking phù hợp' : 'Nhập thông tin để tìm kiếm'}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {searchResults.map(booking => (
                                        <Card key={booking.id} className="mb-3 border">
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col md={8}>
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div>
                                                                <h6 className="mb-1">
                                                                    Booking #{booking.id}
                                                                    <span className="ms-2">{getStatusBadge(booking.status)}</span>
                                                                </h6>
                                                                <div className="text-muted small mb-2">{booking.courtName}</div>
                                                            </div>
                                                        </div>

                                                        <Row className="small">
                                                            <Col sm={6} className="mb-2">
                                                                <FiUser className="me-2 text-muted" />
                                                                <strong>Khách hàng:</strong> {booking.userName}
                                                            </Col>
                                                            <Col sm={6} className="mb-2">
                                                                <FiClock className="me-2 text-muted" />
                                                                <strong>Thời gian:</strong> {booking.date} {booking.startTime}-{booking.endTime}
                                                            </Col>
                                                            <Col sm={6} className="mb-2">
                                                                <strong>Sân số:</strong> {booking.courtNumber}
                                                            </Col>
                                                            <Col sm={6} className="mb-2">
                                                                <FiDollarSign className="me-2 text-muted" />
                                                                <strong>Giá:</strong> {booking.totalPrice.toLocaleString('vi-VN')} ₫
                                                            </Col>
                                                            <Col sm={12}>
                                                                <strong>Thanh toán:</strong> {getPaymentBadge(booking.paymentStatus)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col md={4} className="text-md-end">
                                                        <Button
                                                            variant="primary"
                                                            size="lg"
                                                            onClick={() => handleCheckIn(booking)}
                                                            className="w-100"
                                                        >
                                                            <FiCheckCircle className="me-2" />
                                                            Check-in Ngay
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Check-ins */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-bottom py-3">
                            <h6 className="mb-0">
                                <FiCheckCircle className="me-2 text-success" />
                                Check-in Gần Đây
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            {recentCheckIns.length > 0 ? (
                                recentCheckIns.map(checkIn => (
                                    <div key={checkIn.id} className="border-bottom pb-3 mb-3 last-child-no-border">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <div className="fw-bold">#{checkIn.bookingId}</div>
                                                <div className="small text-muted">{checkIn.customerName}</div>
                                            </div>
                                            <Badge bg="success" className="rounded-pill">
                                                <FiCheckCircle size={12} />
                                            </Badge>
                                        </div>
                                        <div className="small text-muted">
                                            <div>Sân {checkIn.courtNumber}</div>
                                            <div>{new Date(checkIn.checkInTime).toLocaleString('vi-VN')}</div>
                                            <div className="text-primary">{checkIn.staffName}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-3 text-muted">
                                    <p className="small mb-0">Chưa có check-in nào</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Confirm Check-in Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FiCheckCircle className="me-2 text-primary" />
                        Xác nhận Check-in
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <h6>Thông tin booking:</h6>
                            <div className="bg-light p-3 rounded mb-3">
                                <div className="mb-2"><strong>Mã:</strong> #{selectedBooking.id}</div>
                                <div className="mb-2"><strong>Khách hàng:</strong> {selectedBooking.userName}</div>
                                <div className="mb-2"><strong>Sân:</strong> {selectedBooking.courtName} - Sân {selectedBooking.courtNumber}</div>
                                <div className="mb-2"><strong>Thời gian:</strong> {selectedBooking.date} {selectedBooking.startTime}-{selectedBooking.endTime}</div>
                                <div><strong>Giá:</strong> {selectedBooking.totalPrice.toLocaleString('vi-VN')} ₫</div>
                            </div>
                            <p className="mb-0">Bạn có chắc chắn muốn check-in booking này không?</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        <FiX className="me-2" />
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={confirmCheckIn}>
                        <FiCheckCircle className="me-2" />
                        Xác nhận Check-in
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckIn;
