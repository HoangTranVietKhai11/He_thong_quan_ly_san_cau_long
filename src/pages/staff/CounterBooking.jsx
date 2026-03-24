import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner, Modal, Table } from 'react-bootstrap';
import { BiCalendar, BiTime, BiDollar, BiUser, BiPhone, BiCheck, BiRefresh, BiBox } from 'react-icons/bi';
import courtService from '../../services/courtService';
import bookingService from '../../services/bookingService';
import staffOpsService from '../../services/staffOpsService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

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
            <Modal.Header closeButton className="fw-bold">Dịch vụ cộng thêm - Booking #{booking?.id}</Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={5} className="border-end">
                        <h6 className="fw-bold mb-3">Thêm dịch vụ/thiết bị</h6>
                        <Form onSubmit={handleAdd}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sản phẩm</Form.Label>
                                <Form.Select value={form.equipment_id} onChange={e => setForm({...form, equipment_id: e.target.value})} required>
                                    <option value="">Chọn...</option>
                                    {equipments.map(e => <option key={e.id} value={e.id}>{e.name} ({fmt(e.rental_price)})</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Xác nhận</Button>
                        </Form>
                    </Col>
                    <Col md={7}>
                        <h6 className="fw-bold mb-3">Danh sách sử dụng</h6>
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
                                    {rentals.length === 0 && <tr><td colSpan="4" className="text-center py-3 text-muted">Chưa có dịch vụ nào</td></tr>}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

const CounterBooking = () => {
    const [bookingData, setBookingData] = useState({
        booking_date: new Date().toISOString().split('T')[0],
        time_slot: '',
        court_id: '',
        customer_name: '',
        customer_phone: '',
        payment_status: 'Paid',
        payment_method: 'Cash'
    });

    const [courts, setCourts] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingCourts, setLoadingCourts] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [showRentalModal, setShowRentalModal] = useState(null);
    const [error, setError] = useState('');

    const fetchCourts = async () => {
        try {
            setLoadingCourts(true);
            const res = await courtService.getCourts({ limit: 100 });
            setCourts(res.data.courts || res.data.data || []);
        } catch (err) {
            setError('Không thể tải danh sách sân');
        } finally {
            setLoadingCourts(false);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, []);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setBookingData({ ...bookingData, booking_date: date, time_slot: '', court_id: '' });
        setAvailableSlots([]);
    };

    const handleCourtSelect = async (court) => {
        setBookingData({ ...bookingData, court_id: court.id, time_slot: '' });
        try {
            setLoadingSlots(true);
            const res = await courtService.getAvailableTimeSlots(court.id, bookingData.booking_date);
            setAvailableSlots(res.data || []);
        } catch (err) {
            setError('Không thể tải lịch trống của sân này');
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setBookingData({ ...bookingData, time_slot: slot.time });
        setTotalPrice(slot.price);
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await bookingService.createBooking({
                ...bookingData,
                total_price: totalPrice,
                is_onsite: true // Đánh dấu booking tại quầy
            });
            const created = res.data.booking || res.data.data || { id: res.data.id || 'N/A' };
            setCreatedBooking(created);
            setShowSuccess(true);
            // Don't auto-clear yet to allow rental
        } catch (err) {
            setError('Lỗi khi tạo booking: ' + (err.response?.data?.message || err.message));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Đặt sân tại quầy (POS)</h2>
                    <p className="text-muted mb-0">Hỗ trợ khách hàng đặt sân trực tiếp tại CLB</p>
                </div>
                <Button variant="outline-secondary" onClick={fetchCourts}><BiRefresh /> Làm mới</Button>
            </div>

            {showSuccess && (
                <Alert variant="success" className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <BiCheck size={20} className="me-2" />
                        Đặt sân tại quầy thành công cho <strong>{bookingData.customer_name}</strong>!
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="success" size="sm" onClick={() => setShowRentalModal(createdBooking)}>
                            <BiBox className="me-1" /> Thuê thêm thiết bị
                        </Button>
                        <Button variant="outline-success" size="sm" onClick={() => {
                             setBookingData({
                                booking_date: new Date().toISOString().split('T')[0],
                                time_slot: '',
                                court_id: '',
                                customer_name: '',
                                customer_phone: '',
                                payment_status: 'Paid',
                                payment_method: 'Cash'
                            });
                            setAvailableSlots([]);
                            setTotalPrice(0);
                            setShowSuccess(false);
                        }}>Đặt ca tiếp theo</Button>
                    </div>
                </Alert>
            )}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Form onSubmit={handleCreateBooking}>
                <Row>
                    <Col lg={8}>
                        {/* 1. Date & Court Selection */}
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-bottom"><h6 className="mb-0">Bước 1: Chọn Sân & Ngày</h6></Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Label className="small text-muted text-uppercase fw-bold">Ngày chơi</Form.Label>
                                        <Form.Control type="date" value={bookingData.booking_date} onChange={handleDateChange} required />
                                    </Col>
                                </Row>
                                <Form.Label className="small text-muted text-uppercase fw-bold">Chọn sân</Form.Label>
                                {loadingCourts ? <div className="text-center py-3"><Spinner size="sm" /></div> : (
                                    <div className="d-flex flex-wrap gap-2">
                                        {courts.map((court) => (
                                            <Button 
                                                key={court.id} 
                                                variant={bookingData.court_id === court.id ? 'primary' : 'outline-primary'}
                                                onClick={() => handleCourtSelect(court)}
                                                className="px-4 py-2"
                                            >
                                                {court.name}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* 2. Time Slot Selection */}
                        {bookingData.court_id && (
                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Header className="bg-white border-bottom"><h6 className="mb-0">Bước 2: Chọn Khung Giờ</h6></Card.Header>
                                <Card.Body>
                                    {loadingSlots ? <div className="text-center py-4"><Spinner /></div> : (
                                        <Row className="g-2">
                                            {availableSlots.length > 0 ? availableSlots.map((slot) => (
                                                <Col md={3} key={slot.time}>
                                                    <Button
                                                        variant={bookingData.time_slot === slot.time ? 'success' : slot.available ? 'outline-success' : 'outline-secondary'}
                                                        className="w-100 py-3"
                                                        disabled={!slot.available}
                                                        onClick={() => handleSlotSelect(slot)}
                                                    >
                                                        <div className="fw-bold">{slot.time}</div>
                                                        <small>{formatPrice(slot.price)}</small>
                                                    </Button>
                                                </Col>
                                            )) : <Col className="text-center py-3 text-muted">Không còn giờ trống trong ngày này</Col>}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        )}

                        {/* 3. Customer Info */}
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-bottom"><h6 className="mb-0">Bước 3: Thông Tin Khách Hàng</h6></Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Tên khách hàng</Form.Label><Form.Control placeholder="Nhập tên" value={bookingData.customer_name} onChange={e => setBookingData({...bookingData, customer_name: e.target.value})} required /></Form.Group></Col>
                                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Số điện thoại</Form.Label><Form.Control placeholder="Nhập SĐT" value={bookingData.customer_phone} onChange={e => setBookingData({...bookingData, customer_phone: e.target.value})} required /></Form.Group></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Summary & Register */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                            <Card.Header className="bg-dark text-white"><h6 className="mb-0"><BiDollar className="me-2" />Tóm tắt Booking</h6></Card.Header>
                            <Card.Body>
                                <ul className="list-unstyled mb-4">
                                    <li className="d-flex justify-content-between mb-2"><span className="text-muted">Ngày:</span> <strong>{bookingData.booking_date}</strong></li>
                                    <li className="d-flex justify-content-between mb-2"><span className="text-muted">Sân:</span> <strong>{courts.find(c => c.id === bookingData.court_id)?.name || '---'}</strong></li>
                                    <li className="d-flex justify-content-between mb-2"><span className="text-muted">Giờ:</span> <strong>{bookingData.time_slot || '---'}</strong></li>
                                    <li className="d-flex justify-content-between pt-3 border-top"><span className="text-muted">Khách hàng:</span> <strong>{bookingData.customer_name || '---'}</strong></li>
                                </ul>
                                <div className="d-flex justify-content-between align-items-center mb-4"><span className="h5 mb-0">Thành tiền:</span> <h3 className="text-primary mb-0">{formatPrice(totalPrice)}</h3></div>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="small text-muted text-uppercase fw-bold">Trạng thái thanh toán</Form.Label>
                                    <Form.Select value={bookingData.payment_status} onChange={e => setBookingData({...bookingData, payment_status: e.target.value})}>
                                        <option value="Paid">Đã thanh toán (Thu tiền ngay)</option>
                                        <option value="Pending">Chưa thanh toán (Trả sau)</option>
                                    </Form.Select>
                                </Form.Group>

                                {bookingData.payment_status === 'Paid' && (
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small text-muted text-uppercase fw-bold">Phương thức</Form.Label>
                                        <Form.Select value={bookingData.payment_method} onChange={e => setBookingData({...bookingData, payment_method: e.target.value})}>
                                            <option value="Cash">Tiền mặt</option>
                                            <option value="Card">Quẹt thẻ</option>
                                            <option value="Transfer">Chuyển khoản</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                <Button type="submit" variant="primary" className="w-100 py-3 fw-bold" disabled={!bookingData.time_slot || !bookingData.customer_name}>
                                    <BiCheck size={20} className="me-2" /> HOÀN TẤT ĐẶT SÂN
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <RentalModal 
                show={!!showRentalModal} 
                onHide={() => setShowRentalModal(null)} 
                booking={showRentalModal} 
                onSuccess={() => {}}
            />
        </Container>
    );
};

export default CounterBooking;
