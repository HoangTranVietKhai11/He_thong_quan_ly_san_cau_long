import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Alert, Spinner } from 'react-bootstrap';
import { BiSearch, BiCheck, BiPrinter, BiDollar, BiCreditCard, BiMoney, BiRefresh } from 'react-icons/bi';
import bookingService from '../../../services/bookingService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const statusMap = {
    'Fully Paid': { label: 'Đã thanh toán', color: 'success' },
    'Partially Paid': { label: 'Chờ xác nhận', color: 'warning' },
    'Pending': { label: 'Chưa thanh toán', color: 'danger' },
    'Confirmed': { label: 'Chưa thanh toán', color: 'danger' }, // Confirmed nhưng chưa paid
    'Cancelled': { label: 'Đã hủy', color: 'secondary' },
    'Active': { label: 'Hoàn tất', color: 'info' }
};

const CounterPayments = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState({ msg: '', variant: 'success' });

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await bookingService.getAllBookings();
            setInvoices(res.data?.data || res.data || []);
        } catch (err) {
            setToast({ msg: 'Lỗi tải danh sách hóa đơn!', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filtered = invoices.filter(inv => {
        const customerName = inv.user_name || inv.customer_name || 'Khách vãng lai';
        const bookingIdStr = String(inv.id);
        const phoneStr = inv.user_phone || '';
        
        const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) ||
            bookingIdStr.includes(search) || phoneStr.includes(search);
        
        const matchStatus = filterStatus === 'all' || 
            (filterStatus === 'unpaid' && (inv.status === 'Pending' || inv.status === 'Confirmed')) ||
            (filterStatus === 'partial' && inv.status === 'Partially Paid') ||
            (filterStatus === 'paid' && inv.status === 'Fully Paid');
            
        return matchSearch && matchStatus;
    });

    const openPay = (inv) => {
        setSelected(inv);
        setShowModal(true);
    };

    const handleConfirmPayment = async () => {
        setProcessing(true);
        try {
            await bookingService.markAsPaid(selected.id);
            setToast({ msg: `✅ Đã duyệt thanh toán thành công cho đơn #${selected.id}!`, variant: 'success' });
            setShowModal(false);
            fetchInvoices(); // Reload data
        } catch (err) {
            setToast({ msg: 'Lỗi khi duyệt thanh toán!', variant: 'danger' });
        } finally {
            setProcessing(false);
        }
    };

    const totalCollected = invoices.filter(i => i.status === 'Fully Paid').reduce((s, i) => s + parseFloat(i.total_price), 0);
    const pendingCount = invoices.filter(i => i.status === 'Partially Paid').length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Thanh toán & Thu ngân</h2>
                    <p className="text-muted mb-0">Duyệt chuyển khoản và thu tiền mặt trực tiếp</p>
                </div>
                <Button variant="outline-primary" onClick={fetchInvoices} disabled={loading}>
                    <BiRefresh className={loading ? 'spin' : ''} /> Làm mới
                </Button>
            </div>

            {toast.msg && <Alert variant={toast.variant} onClose={() => setToast({ ...toast, msg: '' })} dismissible>{toast.msg}</Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng thu hôm nay', value: fmt(totalCollected), color: 'success' },
                    { label: 'Chờ xác nhận', value: pendingCount + ' đơn hàng', color: 'warning' },
                    { label: 'Chưa thanh toán', value: invoices.filter(i => i.status === 'Pending' || i.status === 'Confirmed').length + ' đơn', color: 'danger' },
                    { label: 'Tổng đơn hàng', value: invoices.length + ' giao dịch', color: 'info' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Card.Body className="position-relative">
                                <div className={`text-${s.color} small fw-bold text-uppercase mb-1`}>{s.label}</div>
                                <h4 className="fw-bold mb-0">{s.value}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Row className="g-2">
                        <Col md={7}><InputGroup>
                            <InputGroup.Text><BiSearch /></InputGroup.Text>
                            <Form.Control placeholder="Tìm theo tên khách, mã đơn, SĐT..." value={search} onChange={e => setSearch(e.target.value)} />
                        </InputGroup></Col>
                        <Col md={5}><Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="unpaid">Chưa thanh toán</option>
                            <option value="partial">Chờ xác nhận (Khách đã báo CK)</option>
                            <option value="paid">Đã thanh toán (Hoàn tất)</option>
                        </Form.Select></Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã Đơn</th><th>Khách hàng</th><th>Sân / Giờ</th>
                                    <th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy đơn hàng nào phù hợp.</td></tr>
                                ) : filtered.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="align-middle"><strong>#{inv.id}</strong><br /><small className="text-muted">{new Date(inv.created_at).toLocaleDateString('vi-VN')}</small></td>
                                        <td className="align-middle"><div>{inv.user_name || 'Khách vãng lai'}</div><small className="text-muted">{inv.user_phone || '---'}</small></td>
                                        <td className="align-middle"><div>{inv.court_name}</div><small className="text-muted">{inv.booking_date} | {inv.start_time}-{inv.end_time}</small></td>
                                        <td className="align-middle fw-bold">{fmt(inv.total_price)}</td>
                                        <td className="align-middle">
                                            <Badge bg={statusMap[inv.status]?.color || 'secondary'}>{statusMap[inv.status]?.label || inv.status}</Badge>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-1">
                                                {inv.status !== 'Fully Paid' && inv.status !== 'Cancelled' && (
                                                    <Button size="sm" variant={inv.status === 'Partially Paid' ? 'warning' : 'success'} onClick={() => openPay(inv)}>
                                                        <BiDollar /> {inv.status === 'Partially Paid' ? 'Duyệt CK' : 'Thu tiền'}
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline-secondary"><BiPrinter /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className={`bg-${selected?.status === 'Partially Paid' ? 'warning' : 'success'} text-white`}>
                    <Modal.Title>{selected?.status === 'Partially Paid' ? 'Duyệt chuyển khoản' : 'Thu tiền mặt tại quầy'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selected && (
                        <>
                            <div className="bg-light rounded p-3 mb-3">
                                <div className="d-flex justify-content-between mb-2"><strong>Mã đơn:</strong> <span>#{selected.id}</span></div>
                                <div className="d-flex justify-content-between mb-2"><strong>Khách hàng:</strong> <span>{selected.user_name}</span></div>
                                <div className="d-flex justify-content-between mb-2"><strong>Sân:</strong> <span>{selected.court_name}</span></div>
                                <div className="d-flex justify-content-between mb-2"><strong>Thời gian:</strong> <span>{selected.start_time} - {selected.end_time}</span></div>
                                <hr />
                                <div className="d-flex justify-content-between text-danger fw-bold"><strong>CẦN THU:</strong> <span className="fs-5">{fmt(selected.total_price)}</span></div>
                            </div>
                            
                            {selected.status === 'Partially Paid' && (
                                <Alert variant="warning" className="small">
                                    Khách hàng đã nhấn nút "Đã chuyển khoản". Vui lòng kiểm tra sao kê ngân hàng trước khi xác nhận.
                                </Alert>
                            )}
                            
                            <p className="text-muted small">Nhấn xác nhận sẽ cập nhật trạng thái đơn hàng thành <strong>"Đã thanh toán"</strong> và ghi nhận vào doanh thu.</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant={selected?.status === 'Partially Paid' ? 'warning' : 'success'} onClick={handleConfirmPayment} disabled={processing}>
                        {processing ? <Spinner size="sm" /> : <><BiCheck className="me-2" /> Duyệt & Xác nhận</>}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CounterPayments;
