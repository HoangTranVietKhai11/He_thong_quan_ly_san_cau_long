import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert, Modal, Nav, Table, Spinner } from 'react-bootstrap';
import { FiSearch, FiCheckCircle, FiX, FiClock, FiUser, FiDollarSign } from 'react-icons/fi';
import { BiQrScan, BiMoney } from 'react-icons/bi';
import checkinService from '../../services/checkinService';
import staffOpsService from '../../services/staffOpsService';
import bookingService from '../../services/bookingService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const STATUS_BADGE = {
    Pending: 'warning', 'Partially Paid': 'info', 'Fully Paid': 'success',
    Active: 'primary', Cancelled: 'danger'
};

const RentalModal = ({ show, onHide, booking, onSuccess }) => {
    const [equipments, setEquipments] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ equipment_id: '', quantity: 1 });

    const load = async () => {
        if (!booking) return;
        setLoading(true);
        try {
            const eqRes = await staffOpsService.getEquipments();
            setEquipments(eqRes.data.equipments || eqRes.data.data || []);
            const rentRes = await staffOpsService.getRentalsByBooking(booking.id);
            setRentals(rentRes.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (show) load(); }, [show, booking]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await staffOpsService.addRental({ ...form, booking_id: booking.id });
            load();
            onSuccess();
        } catch (e) { alert(e.response?.data?.message || 'Lỗi khi thuê'); }
    };

    const handleReturn = async (id) => {
        try {
            await staffOpsService.returnRental(id);
            load();
            onSuccess();
        } catch (e) { alert(e.response?.data?.message || 'Lỗi khi trả'); }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="fw-bold">Thuê thiết bị - Booking #{booking?.id}</Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={5} className="border-end">
                        <h6 className="fw-bold mb-3">Thêm món mới</h6>
                        <Form onSubmit={handleAdd}>
                            <Form.Group className="mb-3">
                                <Form.Label>Thiết bị / Đồ uống</Form.Label>
                                <Form.Select value={form.equipment_id} onChange={e => setForm({...form, equipment_id: e.target.value})} required>
                                    <option value="">Chọn...</option>
                                    {equipments.map(e => <option key={e.id} value={e.id}>{e.name} ({fmt(e.rental_price)})</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Xác nhận lấy</Button>
                        </Form>
                    </Col>
                    <Col md={7}>
                        <h6 className="fw-bold mb-3">Danh sách đã thuê</h6>
                        {loading ? <Spinner size="sm" /> : (
                            <Table size="sm" hover>
                                <thead><tr><th>Tên</th><th>SL</th><th>Tổng</th><th></th></tr></thead>
                                <tbody>
                                    {rentals.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.equipment_name}</td>
                                            <td>{r.quantity}</td>
                                            <td>{fmt(r.total_price)}</td>
                                            <td>
                                                {r.status === 'Rented' ? (
                                                    <Button size="sm" variant="outline-success" onClick={() => handleReturn(r.id)}>Trả</Button>
                                                ) : <Badge bg="secondary">Đã trả</Badge>}
                                            </td>
                                        </tr>
                                    ))}
                                    {rentals.length === 0 && <tr><td colSpan="4" className="text-center py-3 text-muted">Chưa thuê gì</td></tr>}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

const CheckIn = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('booking_id');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [todayBookings, setTodayBookings] = useState([]);
    const [todayLoading, setTodayLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showExtendModal, setShowExtendModal] = useState(null);
    const [showRentalModal, setShowRentalModal] = useState(null);
    const [extendMinutes, setExtendMinutes] = useState(30);
    const [checkInSuccess, setCheckInSuccess] = useState('');
    const [error, setError] = useState('');
    const [qrInput, setQrInput] = useState('');

    const fetchTodayBookings = async () => {
        try {
            setTodayLoading(true);
            const res = await checkinService.getTodayBookings();
            setTodayBookings(res.data || []);
        } catch (e) {
            setError('Không thể tải danh sách booking: ' + (e.response?.data?.message || e.message));
        } finally {
            setTodayLoading(false);
        }
    };

    useEffect(() => { fetchTodayBookings(); }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        
        let queryVal = searchQuery.trim();
        if (searchType === 'booking_id') {
            queryVal = queryVal.replace(/\D/g, '');
            if (!queryVal) return;
        }

        try {
            setSearchLoading(true);
            const res = await checkinService.searchBooking(queryVal, searchType);
            setSearchResults(res.data || []);
        } catch (e) {
            setError('Lỗi tìm kiếm: ' + (e.response?.data?.message || e.message));
        } finally {
            setSearchLoading(false);
        }
    };

    const handleCheckIn = (booking) => {
        setSelectedBooking(booking);
        setShowConfirmModal(true);
    };

    const confirmCheckIn = async () => {
        try {
            await checkinService.checkIn(selectedBooking.id);
            setCheckInSuccess(`Check-in thành công: ${selectedBooking.user_name} — ${selectedBooking.court_name}`);
            setShowConfirmModal(false);
            setSelectedBooking(null);
            setSearchQuery('');
            setSearchResults([]);
            await fetchTodayBookings();
            setTimeout(() => setCheckInSuccess(''), 5000);
        } catch (e) {
            setError('Lỗi check-in: ' + (e.response?.data?.message || e.message));
            setShowConfirmModal(false);
        }
    };

    const confirmExtend = async () => {
        try {
            const res = await checkinService.extendBooking(showExtendModal.id, extendMinutes);
            const data = res.data || {};
            setCheckInSuccess(`Đã gia hạn ${extendMinutes} phút. Phụ thu: ${fmt(data.extend_fee)}`);
            setShowExtendModal(null);
            await fetchTodayBookings();
            setTimeout(() => setCheckInSuccess(''), 5000);
        } catch (e) {
            setError('Lỗi gia hạn: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleQrScan = async () => {
        if (!qrInput) return;
        
        const queryVal = qrInput.trim().replace(/\D/g, '');
        if (!queryVal) {
             setError('Lỗi quét QR: Mã định dạng không hợp lệ.');
             return;
        }

        try {
            const res = await checkinService.searchBooking(queryVal, 'booking_id');
            const data = res.data || [];
            if (data.length > 0) {
                handleCheckIn(data[0]);
                setQrInput(''); // Clear input on success
            } else {
                setError(`Không tìm thấy booking với mã #${queryVal}!`);
            }
        } catch (e) {
            setError('Lỗi quét QR: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleMarkAsPaid = async (bookingId) => {
        try {
            const res = await bookingService.markAsPaid(bookingId);
            setCheckInSuccess(res.data?.message || 'Đã xác nhận thanh toán thành công!');
            await fetchTodayBookings();
            setTimeout(() => setCheckInSuccess(''), 5000);
        } catch (e) {
            setError('Lỗi xác nhận thanh toán: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1"><FiCheckCircle className="me-2 text-primary" />Check-in Khách Hàng</h3>
                    <p className="text-muted mb-0">Tìm kiếm và xác nhận check-in booking</p>
                </div>
            </div>

            {checkInSuccess && <Alert variant="success" dismissible onClose={() => setCheckInSuccess('')}><FiCheckCircle className="me-2" />{checkInSuccess}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="pb-0">
                    <Nav variant="tabs">
                        <Nav.Item><Nav.Link active={activeTab === 'search'} onClick={() => setActiveTab('search')}><FiSearch className="me-2" />Tìm kiếm</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link active={activeTab === 'today'} onClick={() => setActiveTab('today')}><FiClock className="me-2" />Hôm nay ({todayBookings.length})</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link active={activeTab === 'qr'} onClick={() => setActiveTab('qr')}><BiQrScan className="me-2" />Quét QR</Nav.Link></Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>

            {/* Search Tab */}
            {activeTab === 'search' && (
                <>
                    <Card className="mb-4 shadow-sm border-0">
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <Form.Select className="mb-3 mb-md-0" value={searchType} onChange={e => setSearchType(e.target.value)}>
                                        <option value="booking_id">Mã đặt sân</option>
                                        <option value="name">Tên khách hàng</option>
                                        <option value="email">Email</option>
                                    </Form.Select>
                                </Col>
                                <Col md={9}>
                                    <InputGroup size="lg">
                                        <InputGroup.Text className="bg-light"><FiSearch /></InputGroup.Text>
                                        <Form.Control
                                            placeholder="Nhập để tìm kiếm..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Button variant="primary" onClick={handleSearch} disabled={searchLoading}>
                                            {searchLoading ? <Spinner size="sm" animation="border" /> : 'Tìm'}
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white"><h5 className="mb-0">Kết quả {searchResults.length > 0 && <Badge bg="primary" className="ms-2">{searchResults.length}</Badge>}</h5></Card.Header>
                        <Card.Body>
                            {searchResults.length === 0 ? (
                                <div className="text-center py-5 text-muted"><FiSearch size={48} className="mb-3 opacity-25" /><p>{searchQuery ? 'Không tìm thấy booking phù hợp' : 'Nhập thông tin để tìm kiếm'}</p></div>
                            ) : searchResults.map(booking => (
                                <Card key={booking.id} className="mb-3 border">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={8}>
                                                <h6>Booking #{booking.id} — <Badge bg={booking.is_checked_in ? 'success' : 'warning'}>{booking.is_checked_in ? 'Đã check-in' : 'Chưa check-in'}</Badge></h6>
                                                <Row className="small text-muted">
                                                    <Col sm={6}><FiUser className="me-1" />{booking.user_name} ({booking.user_email})</Col>
                                                    <Col sm={6}><FiClock className="me-1" />{booking.booking_date} {booking.start_time}–{booking.end_time}</Col>
                                                    <Col sm={6}>Sân: <strong>{booking.court_name}</strong></Col>
                                                    <Col sm={6}><FiDollarSign className="me-1" />{parseFloat(booking.total_price || 0).toLocaleString('vi-VN')} ₫</Col>
                                                </Row>
                                            </Col>
                                            <Col md={4} className="text-md-end">
                                                {!booking.is_checked_in ? (
                                                    <Button variant="primary" size="lg" className="w-100" onClick={() => handleCheckIn(booking)}>
                                                        <FiCheckCircle className="me-2" />Check-in Ngay
                                                    </Button>
                                                ) : (
                                                    <Button variant="warning" size="lg" className="w-100 mb-2" onClick={() => setShowExtendModal(booking)}>
                                                        <FiClock className="me-2" />Gia hạn
                                                    </Button>
                                                )}
                                                <Button variant="outline-dark" className="w-100" onClick={() => setShowRentalModal(booking)}>
                                                    Thuê đồ / Dịch vụ
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Today Tab */}
            {activeTab === 'today' && (
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white"><h5 className="mb-0">Booking Hôm Nay</h5></Card.Header>
                    <Card.Body>
                        {todayLoading ? <div className="text-center py-4"><Spinner animation="border" /></div> : (
                            <Table responsive hover>
                                <thead><tr><th>Mã</th><th>Khách hàng</th><th>Sân</th><th>Giờ</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                                <tbody>
                                    {todayBookings.map(b => (
                                        <tr key={b.id}>
                                            <td>#{b.id}</td>
                                            <td>{b.user_name}<br/><small className="text-muted">{b.user_email}</small></td>
                                            <td>{b.court_name}</td>
                                            <td>{b.start_time} – {b.end_time}</td>
                                            <td>{parseFloat(b.total_price || 0).toLocaleString('vi-VN')} ₫</td>
                                            <td>
                                                <Badge bg={STATUS_BADGE[b.status] || 'secondary'}>{b.status}</Badge>
                                                {b.checked_in_at && <Badge bg="success" className="ms-1">✓ Check-in</Badge>}
                                            </td>
                                            <td>
                                                {!b.checked_in_at ? (
                                                    <Button size="sm" variant="primary" onClick={() => handleCheckIn(b)}>Check-in</Button>
                                                ) : (
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        <Button size="sm" variant="warning" onClick={() => setShowExtendModal(b)}>Gia hạn</Button>
                                                        <Button size="sm" variant="outline-dark" onClick={() => setShowRentalModal(b)}>Thuê đồ</Button>
                                                        {b.status !== 'Fully Paid' && b.status !== 'Cancelled' && (
                                                            <Button size="sm" variant="success" onClick={() => handleMarkAsPaid(b.id)}>
                                                                <BiMoney className="me-1" />Thu tiền
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                        {!todayLoading && todayBookings.length === 0 && <div className="text-center py-4 text-muted">Không có booking nào hôm nay.</div>}
                    </Card.Body>
                </Card>
            )}

            {/* QR Tab */}
            {activeTab === 'qr' && (
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body className="py-5">
                                <BiQrScan size={80} className="text-primary mb-3" />
                                <h5>Quét mã QR đặt sân</h5>
                                <p className="text-muted mb-4">Nhập mã booking để check-in nhanh</p>
                                <InputGroup className="mb-3">
                                    <Form.Control placeholder="Nhập mã booking (VD: 1, 2, 3...)" value={qrInput} onChange={e => setQrInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleQrScan()} />
                                    <Button variant="primary" onClick={handleQrScan}><BiQrScan className="me-1" />Xác nhận</Button>
                                </InputGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Equipment Rental Modal */}
            <RentalModal 
                show={!!showRentalModal} 
                onHide={() => setShowRentalModal(null)} 
                booking={showRentalModal} 
                onSuccess={() => {
                    setCheckInSuccess('Đã cập nhật danh sách thuê thiết bị');
                    setTimeout(() => setCheckInSuccess(''), 3000);
                }}
            />

            {/* Confirm Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Xác nhận Check-in</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div className="bg-light p-3 rounded">
                            <div className="mb-2"><strong>Mã:</strong> #{selectedBooking.id}</div>
                            <div className="mb-2"><strong>Khách:</strong> {selectedBooking.user_name}</div>
                            <div className="mb-2"><strong>Sân:</strong> {selectedBooking.court_name}</div>
                            <div className="mb-2"><strong>Ngày:</strong> {new Date(selectedBooking.booking_date).toLocaleDateString('vi-VN')}</div>
                            <div className="mb-2"><strong>Giờ:</strong> {selectedBooking.start_time?.substring(0,5)} – {selectedBooking.end_time?.substring(0,5)}</div>
                            <div><strong>Giá:</strong> {parseFloat(selectedBooking.total_price || 0).toLocaleString('vi-VN')} ₫</div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}><FiX className="me-2" />Hủy</Button>
                    <Button variant="primary" onClick={confirmCheckIn}><FiCheckCircle className="me-2" />Xác nhận</Button>
                </Modal.Footer>
            </Modal>

            {/* Extend Modal */}
            <Modal show={!!showExtendModal} onHide={() => setShowExtendModal(null)} centered>
                <Modal.Header closeButton><Modal.Title>Gia hạn giờ chơi</Modal.Title></Modal.Header>
                <Modal.Body>
                    {showExtendModal && (
                        <>
                            <Alert variant="info" className="small">Gia hạn cho <strong>{showExtendModal.user_name}</strong> — {showExtendModal.court_name}</Alert>
                            <Form.Group>
                                <Form.Label>Thời gian gia hạn</Form.Label>
                                <div className="d-flex gap-2">
                                    {[30, 60, 90].map(m => (
                                        <Button key={m} variant={extendMinutes === m ? 'warning' : 'outline-warning'} className="flex-grow-1" onClick={() => setExtendMinutes(m)}>+{m} phút</Button>
                                    ))}
                                </div>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExtendModal(null)}>Hủy</Button>
                    <Button variant="warning" onClick={confirmExtend}>Xác nhận gia hạn</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckIn;
