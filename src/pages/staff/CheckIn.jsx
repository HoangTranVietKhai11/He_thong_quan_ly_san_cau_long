import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert, Modal, Nav, Table } from 'react-bootstrap';
import { FiSearch, FiCheckCircle, FiX, FiClock, FiUser, FiDollarSign } from 'react-icons/fi';
import { BiQrScan, BiPlus } from 'react-icons/bi';
import { mockBookings, mockCheckIns, mockUsers } from '../../utils/mockData';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const CheckIn = () => {
    const [activeTab, setActiveTab] = useState('search'); // 'search' | 'qr'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('booking_id');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showExtendModal, setShowExtendModal] = useState(null); // booking to extend
    const [extendMinutes, setExtendMinutes] = useState(30);
    const [checkInSuccess, setCheckInSuccess] = useState('');
    const [recentCheckIns, setRecentCheckIns] = useState(mockCheckIns.slice(0, 4));
    const [qrInput, setQrInput] = useState('');
    const [qrResult, setQrResult] = useState(null);

    const handleSearch = () => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const query = searchQuery.toLowerCase();
        let results = [];
        switch (searchType) {
            case 'booking_id': results = mockBookings.filter(b => b.id.toString() === searchQuery); break;
            case 'name': results = mockBookings.filter(b => b.userName.toLowerCase().includes(query)); break;
            case 'phone': {
                const user = mockUsers.find(u => u.phone.includes(searchQuery));
                if (user) results = mockBookings.filter(b => b.userId === user.id);
                break;
            }
            case 'court': results = mockBookings.filter(b => b.courtNumber.toString() === searchQuery); break;
            default: break;
        }
        results = results.filter(b => !mockCheckIns.find(ci => ci.bookingId === b.id));
        setSearchResults(results);
        if (results.length === 1) setSelectedBooking(results[0]);
    };

    const handleCheckIn = (booking) => {
        setSelectedBooking(booking);
        setShowConfirmModal(true);
    };

    const confirmCheckIn = () => {
        const newCI = {
            id: Date.now(),
            bookingId: selectedBooking.id,
            customerName: selectedBooking.userName,
            checkInTime: new Date().toISOString(),
            staffName: 'Nhân viên A',
            courtNumber: selectedBooking.courtNumber,
        };
        setRecentCheckIns([newCI, ...recentCheckIns]);
        setCheckInSuccess(`Check-in thành công: ${selectedBooking.userName} — Sân ${selectedBooking.courtNumber}`);
        setShowConfirmModal(false);
        setSearchResults(searchResults.filter(b => b.id !== selectedBooking.id));
        setSelectedBooking(null);
        setSearchQuery('');
        setTimeout(() => setCheckInSuccess(''), 4000);
    };

    // Extend handler FE-03.5
    const handleExtend = (checkIn) => {
        setShowExtendModal(checkIn);
        setExtendMinutes(30);
    };

    const confirmExtend = () => {
        const extraFee = (extendMinutes / 60) * 120000;
        setCheckInSuccess(`Đã gia hạn ${extendMinutes} phút cho ${showExtendModal.customerName}. Phụ thu: ${fmt(extraFee)}`);
        setShowExtendModal(null);
        setTimeout(() => setCheckInSuccess(''), 5000);
    };

    // QR simulation FE-03.9
    const handleQrScan = () => {
        const booking = mockBookings.find(b => b.id.toString() === qrInput);
        if (booking) {
            setQrResult({ found: true, booking });
        } else {
            setQrResult({ found: false });
        }
    };

    const getPaymentBadge = (status) => (
        status === 'paid'
            ? <Badge bg="success">Đã thanh toán</Badge>
            : <Badge bg="warning">Chưa thanh toán</Badge>
    );

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1"><FiCheckCircle className="me-2 text-primary" />Check-in Khách Hàng</h3>
                    <p className="text-muted mb-0">Tìm kiếm và xác nhận check-in booking</p>
                </div>
            </div>

            {checkInSuccess && (
                <Alert variant="success" dismissible onClose={() => setCheckInSuccess('')} className="mb-3">
                    <FiCheckCircle className="me-2" />{checkInSuccess}
                </Alert>
            )}

            {/* Tab switch */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="pb-0">
                    <Nav variant="tabs">
                        <Nav.Item>
                            <Nav.Link active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
                                <FiSearch className="me-2" />Tìm kiếm thủ công
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link active={activeTab === 'qr'} onClick={() => setActiveTab('qr')}>
                                <BiQrScan className="me-2" />Quét mã QR
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>

            {/* Manual Search Tab */}
            {activeTab === 'search' && (
                <>
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={3}>
                                    <Form.Group className="mb-3 mb-md-0">
                                        <Form.Label>Tìm kiếm theo</Form.Label>
                                        <Form.Select value={searchType} onChange={e => { setSearchType(e.target.value); setSearchResults([]); setSearchQuery(''); }}>
                                            <option value="booking_id">Mã đặt sân</option>
                                            <option value="name">Tên khách hàng</option>
                                            <option value="phone">Số điện thoại</option>
                                            <option value="court">Số sân</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={9}>
                                    <Form.Label>
                                        {searchType === 'booking_id' ? 'Nhập mã đặt sân' : searchType === 'name' ? 'Tên khách hàng' : searchType === 'phone' ? 'Số điện thoại' : 'Số sân'}
                                    </Form.Label>
                                    <InputGroup size="lg">
                                        <InputGroup.Text className="bg-light"><FiSearch /></InputGroup.Text>
                                        <Form.Control
                                            placeholder="Nhập để tìm kiếm..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Button variant="primary" onClick={handleSearch}><FiSearch className="me-2" />Tìm</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row>
                        <Col lg={8}>
                            <Card className="shadow-sm border-0 mb-4">
                                <Card.Header className="bg-white border-bottom py-3">
                                    <h5 className="mb-0">Kết quả{searchResults.length > 0 && <Badge bg="primary" className="ms-2">{searchResults.length}</Badge>}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {searchResults.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <FiSearch size={48} className="mb-3 opacity-25" />
                                            <p>{searchQuery ? 'Không tìm thấy booking phù hợp' : 'Nhập thông tin để tìm kiếm'}</p>
                                        </div>
                                    ) : (
                                        searchResults.map(booking => (
                                            <Card key={booking.id} className="mb-3 border">
                                                <Card.Body>
                                                    <Row className="align-items-center">
                                                        <Col md={8}>
                                                            <h6 className="mb-1">Booking #{booking.id}</h6>
                                                            <Row className="small text-muted">
                                                                <Col sm={6}><FiUser className="me-1" />{booking.userName}</Col>
                                                                <Col sm={6}><FiClock className="me-1" />{booking.date} {booking.startTime}–{booking.endTime}</Col>
                                                                <Col sm={6}>Sân số: <strong>{booking.courtNumber}</strong></Col>
                                                                <Col sm={6}><FiDollarSign className="me-1" />{booking.totalPrice?.toLocaleString('vi-VN')} ₫</Col>
                                                                <Col sm={12} className="mt-1">{getPaymentBadge(booking.paymentStatus)}</Col>
                                                            </Row>
                                                        </Col>
                                                        <Col md={4} className="text-md-end">
                                                            <Button variant="primary" size="lg" className="w-100" onClick={() => handleCheckIn(booking)}>
                                                                <FiCheckCircle className="me-2" />Check-in Ngay
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="shadow-sm border-0">
                                <Card.Header className="bg-white border-bottom py-3">
                                    <h6 className="mb-0"><FiCheckCircle className="me-2 text-success" />Check-in Gần Đây</h6>
                                </Card.Header>
                                <Card.Body>
                                    {recentCheckIns.map(ci => (
                                        <div key={ci.id} className="border-bottom pb-3 mb-3">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <div>
                                                    <div className="fw-bold small">#{ci.bookingId} — {ci.customerName}</div>
                                                    <div className="text-muted small">Sân {ci.courtNumber} | {new Date(ci.checkInTime).toLocaleTimeString('vi-VN')}</div>
                                                </div>
                                                <Badge bg="success" pill><FiCheckCircle size={12} /></Badge>
                                            </div>
                                            {/* Extend button FE-03.5 */}
                                            <Button size="sm" variant="outline-warning" className="mt-1 w-100" onClick={() => handleExtend(ci)}>
                                                <FiClock className="me-1" />Gia hạn giờ
                                            </Button>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* QR Tab FE-03.9 */}
            {activeTab === 'qr' && (
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body className="py-5">
                                <BiQrScan size={80} className="text-primary mb-3" />
                                <h5 className="fw-bold mb-1">Quét mã QR đặt sân</h5>
                                <p className="text-muted mb-4">Đưa mã QR vào camera hoặc nhập mã booking thủ công</p>
                                <div className="border rounded p-4 mb-4 bg-light" style={{ borderStyle: 'dashed !important', minHeight: 120 }}>
                                    <div className="text-muted small">📷 Vùng quét camera QR</div>
                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>(Demo: nhập mã booking bên dưới)</div>
                                </div>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        placeholder="Hoặc nhập mã booking (VD: 1, 2, 3...)"
                                        value={qrInput}
                                        onChange={e => setQrInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleQrScan()}
                                    />
                                    <Button variant="primary" onClick={handleQrScan}>
                                        <BiQrScan className="me-1" />Xác nhận
                                    </Button>
                                </InputGroup>
                                {qrResult && (
                                    qrResult.found ? (
                                        <Alert variant="success">
                                            <strong>✅ Tìm thấy booking!</strong>
                                            <div className="text-start mt-2 small">
                                                <div><strong>Khách:</strong> {qrResult.booking.userName}</div>
                                                <div><strong>Sân:</strong> {qrResult.booking.courtNumber} — {qrResult.booking.courtName}</div>
                                                <div><strong>Giờ:</strong> {qrResult.booking.date} {qrResult.booking.startTime}–{qrResult.booking.endTime}</div>
                                            </div>
                                            <Button className="mt-2 w-100" variant="success" onClick={() => handleCheckIn(qrResult.booking)}>
                                                <FiCheckCircle className="me-2" />Check-in Ngay
                                            </Button>
                                        </Alert>
                                    ) : (
                                        <Alert variant="danger">❌ Không tìm thấy booking với mã này</Alert>
                                    )
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Confirm Check-in Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title><FiCheckCircle className="me-2 text-primary" />Xác nhận Check-in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div className="bg-light p-3 rounded">
                            <div className="mb-2"><strong>Mã:</strong> #{selectedBooking.id}</div>
                            <div className="mb-2"><strong>Khách:</strong> {selectedBooking.userName}</div>
                            <div className="mb-2"><strong>Sân:</strong> {selectedBooking.courtName} — Sân {selectedBooking.courtNumber}</div>
                            <div className="mb-2"><strong>Thời gian:</strong> {selectedBooking.date} {selectedBooking.startTime}–{selectedBooking.endTime}</div>
                            <div><strong>Giá:</strong> {selectedBooking.totalPrice?.toLocaleString('vi-VN')} ₫</div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}><FiX className="me-2" />Hủy</Button>
                    <Button variant="primary" onClick={confirmCheckIn}><FiCheckCircle className="me-2" />Xác nhận</Button>
                </Modal.Footer>
            </Modal>

            {/* Extend Modal FE-03.5 */}
            <Modal show={!!showExtendModal} onHide={() => setShowExtendModal(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title><FiClock className="me-2 text-warning" />Gia hạn giờ chơi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showExtendModal && (
                        <>
                            <Alert variant="info" className="small">
                                Gia hạn thêm cho <strong>{showExtendModal.customerName}</strong> — Sân {showExtendModal.courtNumber}
                            </Alert>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời gian gia hạn</Form.Label>
                                <div className="d-flex gap-2">
                                    {[30, 60, 90].map(m => (
                                        <Button key={m} variant={extendMinutes === m ? 'warning' : 'outline-warning'}
                                            className="flex-grow-1" onClick={() => setExtendMinutes(m)}>
                                            +{m} phút
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <div className="d-flex justify-content-between p-3 bg-warning bg-opacity-10 rounded">
                                <span>Phụ thu thêm:</span>
                                <strong className="text-warning">{fmt((extendMinutes / 60) * 120000)}</strong>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExtendModal(null)}>Hủy</Button>
                    <Button variant="warning" onClick={confirmExtend}>
                        <BiPlus className="me-2" />Xác nhận gia hạn
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckIn;
