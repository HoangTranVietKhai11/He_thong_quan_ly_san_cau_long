import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { BiCalendar, BiFilter, BiMoney, BiSearch, BiInfoCircle, BiXCircle, BiCheckCircle, BiUser, BiPhone } from 'react-icons/bi';
import bookingService from '../../../services/bookingService';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const BOOKING_STATUS = {
    pending:    { label: 'Chờ xác nhận', color: 'warning' },
    confirmed:  { label: 'Đã xác nhận',  color: 'primary' },
    checked_in: { label: 'Đã check-in',  color: 'info'    },
    completed:  { label: 'Hoàn thành',   color: 'success' },
    cancelled:  { label: 'Đã hủy',       color: 'secondary'},
    'fully paid':{ label: 'Đã TT đầy đủ', color: 'success'},
    active:     { label: 'Đã xác nhận',  color: 'primary' },
};
const PAYMENT_STATUS = {
    pending:  { label: 'Chờ thanh toán', color: 'warning' },
    paid:     { label: 'Đã thanh toán',  color: 'success' },
    refunded: { label: 'Đã hoàn tiền',   color: 'info'    },
};

const mapStatus = (raw) => {
    if (!raw) return 'pending';
    const s = raw.toLowerCase();
    if (s === 'fully paid' || s === 'active') return 'confirmed';
    if (s === 'cancelled')  return 'cancelled';
    if (s === 'completed')  return 'completed';
    if (s === 'confirmed')  return 'confirmed';
    return 'pending';
};

const AllBookings = () => {
    const [bookings,       setBookings]       = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState(null);
    const [filterStatus,   setFilterStatus]   = useState('all');
    const [filterPayment,  setFilterPayment]  = useState('all');
    const [searchTerm,     setSearchTerm]     = useState('');
    const [toast,          setToast]          = useState('');
    const [toastType,      setToastType]      = useState('success');

    // Detail modal
    const [showDetail,     setShowDetail]     = useState(false);
    const [selectedBooking,setSelectedBooking]= useState(null);

    // Cancel modal
    const [showCancel,     setShowCancel]     = useState(false);
    const [cancelReason,   setCancelReason]   = useState('');
    const [cancelLoading,  setCancelLoading]  = useState(false);

    // Confirm loading
    const [confirmLoading, setConfirmLoading]  = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast(msg); setToastType(type);
        setTimeout(() => setToast(''), 5000);
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getBookings();
            const rawData = response.data || response.bookings || [];
            setBookings(rawData.map(b => ({
                id: b.id,
                idStr: `#${b.id}`,
                userName:    b.user_name  || b.username || 'Khách',
                userEmail:   b.user_email || b.email    || '—',
                userPhone:   b.user_phone || b.phone    || '—',
                courtName:   b.court_name  || `Sân ${b.court_id}`,
                location:    b.location    || '—',
                date:        b.booking_date,
                startTime:   (b.start_time || '').substring(0,5),
                endTime:     (b.end_time   || '').substring(0,5),
                price:       Number(b.total_price   || 0),
                amountPaid:  Number(b.amount_paid   || 0),
                rawStatus:   b.status,
                status:      mapStatus(b.status),
                paymentStatus: Number(b.amount_paid) >= Number(b.total_price) && Number(b.total_price) > 0
                    ? 'paid'
                    : (b.status === 'Cancelled' ? 'refunded' : 'pending'),
            })));
        } catch (err) {
            setError(`Lỗi: ${err?.response?.data?.message || err.message}`);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    // Filtering
    let filtered = bookings;
    if (filterStatus  !== 'all') filtered = filtered.filter(b => b.status      === filterStatus);
    if (filterPayment !== 'all') filtered = filtered.filter(b => b.paymentStatus === filterPayment);
    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(b =>
            b.userName.toLowerCase().includes(q) ||
            String(b.id).includes(q) ||
            b.userPhone.includes(q) ||
            b.userEmail.toLowerCase().includes(q)
        );
    }

    const totalRevenue   = bookings.filter(b => b.paymentStatus === 'paid').reduce((s,b)=>s+b.price,0);
    const pendingCount   = bookings.filter(b => b.status === 'pending').length;
    const today          = new Date().toISOString().split('T')[0];
    const todayBookings  = bookings.filter(b => b.date === today).length;

    const openDetail  = (b)  => { setSelectedBooking(b); setShowDetail(true); };
    const openCancel  = (b)  => { setSelectedBooking(b); setCancelReason(''); setShowCancel(true); };

    const handleAdminCancel = async () => {
        if (!selectedBooking) return;
        setCancelLoading(true);
        try {
            const res = await bookingService.adminCancelBooking(selectedBooking.id, cancelReason);
            const refund = res.refundAmount || 0;
            const msg = refund > 0
                ? `✅ Đã hủy booking #${selectedBooking.id} — Hoàn ${formatPrice(refund)} vào ví người dùng!`
                : `✅ Đã hủy booking #${selectedBooking.id} thành công!`;
            showToast(msg, 'success');
            setBookings(prev => prev.map(b => b.id === selectedBooking.id
                ? { ...b, status: 'cancelled', paymentStatus: refund > 0 ? 'refunded' : b.paymentStatus }
                : b
            ));
            setShowCancel(false);
            setShowDetail(false);
        } catch (err) {
            showToast(err.response?.data?.message || err.message || 'Lỗi khi hủy!', 'danger');
        } finally { setCancelLoading(false); }
    };

    const handleAdminConfirm = async (bookingArg = null) => {
        // Hỗ trợ cả khi gọi từ Table (truyền bookingArg) và từ Modal (sử dụng selectedBooking)
        const bookingToConfirm = bookingArg && bookingArg.id ? bookingArg : selectedBooking;
        if (!bookingToConfirm) return;
        
        setConfirmLoading(bookingToConfirm.id);
        try {
            await bookingService.markAsPaid(bookingToConfirm.id);
            showToast(`✅ Đã xác nhận booking #${bookingToConfirm.id} thành công!`, 'success');
            
            setBookings(prev => prev.map(b => b.id === bookingToConfirm.id
                ? { ...b, status: 'confirmed', paymentStatus: 'paid', amountPaid: b.price, rawStatus: 'Fully Paid' }
                : b
            ));
            
            // Nếu đang mở Modal thì đóng Modal luôn
            if (showDetail && selectedBooking?.id === bookingToConfirm.id) {
                setShowDetail(false);
            }
        } catch (err) {
            showToast(err.response?.data?.message || err.message || 'Lỗi khi xác nhận!', 'danger');
        } finally { 
            setConfirmLoading(null); 
        }
    };

    const getStatusBadge  = (s) => { const i = BOOKING_STATUS[s]  || {label:s,color:'secondary'}; return <Badge bg={i.color}>{i.label}</Badge>; };
    const getPaymentBadge = (s) => { const i = PAYMENT_STATUS[s]  || {label:s,color:'secondary'}; return <Badge bg={i.color}>{i.label}</Badge>; };

    return (
        <Container fluid className="py-4">
            {toast && <Alert variant={toastType} onClose={()=>setToast('')} dismissible className="mb-3">{toast}</Alert>}
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">Tất cả đặt sân</h2>
                            <p className="text-muted mb-0">Quản lý và theo dõi tất cả booking</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <Row className="mb-4 g-3">
                        {[
                            { label: 'Tổng booking', value: bookings.length, icon: <BiCalendar size={36}/>, color: 'text-primary' },
                            { label: 'Chờ xác nhận', value: pendingCount,      icon: <BiFilter size={36}/>,   color: 'text-warning' },
                            { label: 'Hôm nay',      value: todayBookings,     icon: <BiCalendar size={36}/>, color: 'text-info'    },
                            { label: 'Doanh thu',    value: formatPrice(totalRevenue), icon: <BiMoney size={36}/>, color: 'text-success' },
                        ].map((s,i) => (
                            <Col md={3} key={i}>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="text-muted small">{s.label}</div>
                                            <h4 className={`fw-bold mb-0 ${s.color}`}>{s.value}</h4>
                                        </div>
                                        <span className={s.color}>{s.icon}</span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Filters */}
                    <Card className="border-0 shadow-sm mb-3">
                        <Card.Body>
                            <Row className="g-2">
                                <Col md={4}>
                                    <InputGroup>
                                        <InputGroup.Text><BiSearch/></InputGroup.Text>
                                        <Form.Control placeholder="Tên, SĐT, Email, Mã booking" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
                                    </InputGroup>
                                </Col>
                                <Col md={4}>
                                    <Form.Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                                        <option value="all">Tất cả trạng thái</option>
                                        <option value="pending">Chờ xác nhận</option>
                                        <option value="confirmed">Đã xác nhận</option>
                                        <option value="cancelled">Đã hủy</option>
                                        <option value="completed">Hoàn thành</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Select value={filterPayment} onChange={e=>setFilterPayment(e.target.value)}>
                                        <option value="all">Tất cả thanh toán</option>
                                        <option value="paid">Đã thanh toán</option>
                                        <option value="pending">Chờ thanh toán</option>
                                        <option value="refunded">Đã hoàn tiền</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Table */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Mã</th>
                                            <th>Khách hàng</th>
                                            <th>SĐT</th>
                                            <th>Sân</th>
                                            <th>Ngày</th>
                                            <th>Giờ</th>
                                            <th>Giá</th>
                                            <th>Trạng thái</th>
                                            <th>Thanh toán</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(b => (
                                            <tr key={b.id}>
                                                <td className="align-middle fw-bold">{b.idStr}</td>
                                                <td className="align-middle">{b.userName}</td>
                                                <td className="align-middle">{b.userPhone}</td>
                                                <td className="align-middle">{b.courtName}</td>
                                                <td className="align-middle">{formatDate(b.date)}</td>
                                                <td className="align-middle">{b.startTime} – {b.endTime}</td>
                                                <td className="align-middle"><strong className="text-primary">{formatPrice(b.price)}</strong></td>
                                                <td className="align-middle">{getStatusBadge(b.status)}</td>
                                                <td className="align-middle">{getPaymentBadge(b.paymentStatus)}</td>
                                                <td className="align-middle">
                                                    <div className="d-flex gap-1 justify-content-start flex-wrap">
                                                        <Button size="sm" variant="outline-primary" onClick={()=>openDetail(b)}>
                                                            <BiInfoCircle className="me-1"/>Chi tiết
                                                        </Button>
                                                        {b.status === 'pending' && (
                                                            <Button size="sm" variant="outline-success" onClick={()=>handleAdminConfirm(b)} disabled={confirmLoading === b.id}>
                                                                {confirmLoading === b.id ? <Spinner size="sm" as="span" className="me-1"/> : <BiCheckCircle className="me-1"/>}
                                                                Xác nhận
                                                            </Button>
                                                        )}
                                                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                                                            <Button size="sm" variant="outline-danger" onClick={()=>openCancel(b)}>
                                                                <BiXCircle className="me-1"/>Hủy
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filtered.length === 0 && (
                                            <tr><td colSpan={10} className="text-center text-muted py-4">Không tìm thấy booking nào</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* ===== MODAL CHI TIẾT ===== */}
            <Modal show={showDetail} onHide={()=>setShowDetail(false)} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><BiInfoCircle className="me-2"/>Chi tiết đặt sân {selectedBooking?.idStr}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <Row>
                            <Col md={6}>
                                <h6 className="fw-bold text-muted mb-3"><BiUser className="me-1"/>Thông tin khách hàng</h6>
                                <table className="table table-borderless table-sm">
                                    <tbody>
                                        <tr><td className="text-muted">Tên:</td><td><strong>{selectedBooking.userName}</strong></td></tr>
                                        <tr><td className="text-muted">Email:</td><td>{selectedBooking.userEmail}</td></tr>
                                        <tr><td className="text-muted"><BiPhone className="me-1"/>SĐT:</td><td>{selectedBooking.userPhone}</td></tr>
                                    </tbody>
                                </table>
                                <h6 className="fw-bold text-muted mb-3 mt-3"><BiCalendar className="me-1"/>Thông tin đặt sân</h6>
                                <table className="table table-borderless table-sm">
                                    <tbody>
                                        <tr><td className="text-muted">Sân:</td><td><strong>{selectedBooking.courtName}</strong></td></tr>
                                        <tr><td className="text-muted">Ngày:</td><td>{formatDate(selectedBooking.date)}</td></tr>
                                        <tr><td className="text-muted">Giờ:</td><td>{selectedBooking.startTime} – {selectedBooking.endTime}</td></tr>
                                    </tbody>
                                </table>
                            </Col>
                            <Col md={6}>
                                <h6 className="fw-bold text-muted mb-3"><BiMoney className="me-1"/>Thanh toán</h6>
                                <table className="table table-borderless table-sm">
                                    <tbody>
                                        <tr><td className="text-muted">Tổng tiền:</td><td><strong className="text-primary">{formatPrice(selectedBooking.price)}</strong></td></tr>
                                        <tr><td className="text-muted">Đã thanh toán:</td><td><strong className="text-success">{formatPrice(selectedBooking.amountPaid)}</strong></td></tr>
                                        <tr><td className="text-muted">Còn lại:</td><td><strong className="text-danger">{formatPrice(selectedBooking.price - selectedBooking.amountPaid)}</strong></td></tr>
                                    </tbody>
                                </table>
                                <div className="mt-3">
                                    <div className="mb-2">Trạng thái: {getStatusBadge(selectedBooking.status)}</div>
                                    <div>Thanh toán: {getPaymentBadge(selectedBooking.paymentStatus)}</div>
                                </div>
                                {selectedBooking.amountPaid > 0 && selectedBooking.status !== 'cancelled' && (
                                    <div className="alert alert-warning mt-3 small mb-0 p-2">
                                        💡 Nếu hủy booking này, <strong>{formatPrice(selectedBooking.amountPaid)}</strong> sẽ được hoàn vào ví người dùng tự động.
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowDetail(false)}>Đóng</Button>
                    {selectedBooking && selectedBooking.status === 'pending' && (
                        <Button variant="success" onClick={() => handleAdminConfirm()} disabled={confirmLoading === selectedBooking.id}>
                            {confirmLoading === selectedBooking.id ? 'Đang xử lý...' : <><BiCheckCircle className="me-1"/>Xác nhận đặt sân</>}
                        </Button>
                    )}
                    {selectedBooking && selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                        <Button variant="danger" onClick={()=>{ setShowDetail(false); openCancel(selectedBooking); }}>
                            <BiXCircle className="me-1"/>Hủy booking này
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* ===== MODAL HỦY BOOKING ===== */}
            <Modal show={showCancel} onHide={()=>setShowCancel(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title><BiXCircle className="me-2"/>Xác nhận hủy booking {selectedBooking?.idStr}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <div className="alert alert-info small">
                                <strong>Khách hàng:</strong> {selectedBooking.userName} | <strong>Sân:</strong> {selectedBooking.courtName}<br/>
                                <strong>Ngày:</strong> {formatDate(selectedBooking.date)} | <strong>Giờ:</strong> {selectedBooking.startTime} – {selectedBooking.endTime}
                            </div>
                            {selectedBooking.amountPaid > 0 ? (
                                <div className="alert alert-success small">
                                    <BiCheckCircle className="me-1"/>
                                    Khách đã thanh toán <strong>{formatPrice(selectedBooking.amountPaid)}</strong> — hệ thống sẽ <strong>tự động hoàn tiền vào ví</strong> sau khi hủy.
                                </div>
                            ) : (
                                <div className="alert alert-secondary small">Booking này chưa thanh toán, không cần hoàn tiền.</div>
                            )}
                            <Form.Group>
                                <Form.Label>Lý do hủy <span className="text-muted">(tùy chọn)</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="VD: Sân bảo trì khẩn cấp, lỗi hệ thống..."
                                    value={cancelReason}
                                    onChange={e=>setCancelReason(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowCancel(false)} disabled={cancelLoading}>Thoát</Button>
                    <Button variant="danger" onClick={handleAdminCancel} disabled={cancelLoading}>
                        {cancelLoading ? 'Đang xử lý...' : '✓ Xác nhận hủy & hoàn tiền'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AllBookings;
