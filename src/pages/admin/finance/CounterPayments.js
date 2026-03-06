import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { BiSearch, BiCheck, BiPrinter, BiDollar, BiCreditCard, BiMoney } from 'react-icons/bi';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const mockInvoices = [
    { id: 'INV-001', bookingId: 'BK-001', customer: 'Nguyễn Văn A', phone: '0901234567', court: 'Sân 3', date: '2026-03-03', timeSlot: '17:00-19:00', totalAmount: 340000, paid: 102000, remaining: 238000, status: 'partial', paymentMethod: null },
    { id: 'INV-002', bookingId: 'BK-002', customer: 'Trần Thị B', phone: '0902345678', court: 'Sân 1', date: '2026-03-03', timeSlot: '08:00-10:00', totalAmount: 240000, paid: 0, remaining: 240000, status: 'unpaid', paymentMethod: null },
    { id: 'INV-003', bookingId: 'BK-003', customer: 'Lê Văn C', phone: '0903456789', court: 'Sân 5', date: '2026-03-03', timeSlot: '10:00-12:00', totalAmount: 300000, paid: 300000, remaining: 0, status: 'paid', paymentMethod: 'cash' },
    { id: 'INV-004', bookingId: 'BK-004', customer: 'Phạm Thị D', phone: '0904567890', court: 'Sân 2', date: '2026-03-03', timeSlot: '19:00-21:00', totalAmount: 340000, paid: 0, remaining: 340000, status: 'unpaid', paymentMethod: null },
    { id: 'INV-005', bookingId: 'BK-005', customer: 'Đỗ Minh E', phone: '0905678901', court: 'Sân 7', date: '2026-03-03', timeSlot: '14:00-16:00', totalAmount: 240000, paid: 72000, remaining: 168000, status: 'partial', paymentMethod: null },
];

const statusMap = {
    paid: { label: 'Đã thanh toán', color: 'success' },
    partial: { label: 'Đặt cọc', color: 'warning' },
    unpaid: { label: 'Chưa thanh toán', color: 'danger' },
};

const CounterPayments = () => {
    const [invoices, setInvoices] = useState(mockInvoices);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [payForm, setPayForm] = useState({ method: 'cash', amount: 0 });
    const [toast, setToast] = useState('');

    const filtered = invoices.filter(inv => {
        const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) ||
            inv.bookingId.includes(search) || inv.phone.includes(search);
        const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const openPay = (inv) => {
        setSelected(inv);
        setPayForm({ method: 'cash', amount: inv.remaining });
        setShowModal(true);
    };

    const handlePay = () => {
        const newPaid = selected.paid + payForm.amount;
        const newStatus = newPaid >= selected.totalAmount ? 'paid' : 'partial';
        setInvoices(invoices.map(inv => inv.id === selected.id
            ? { ...inv, paid: newPaid, remaining: inv.totalAmount - newPaid, status: newStatus, paymentMethod: payForm.method }
            : inv
        ));
        setShowModal(false);
        setToast(`✅ Thanh toán thành công ${fmt(payForm.amount)} cho ${selected.customer}!`);
        setTimeout(() => setToast(''), 4000);
    };

    const totalCollected = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0);
    const pendingTotal = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.remaining, 0);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Thanh toán tại quầy</h2>
                    <p className="text-muted mb-0">Thu tiền trực tiếp từ khách hàng — tiền mặt, thẻ, QR</p>
                </div>
            </div>

            {toast && <Alert variant="success" onClose={() => setToast('')} dismissible>{toast}</Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Đã thu hôm nay', value: fmt(totalCollected), color: 'success' },
                    { label: 'Còn nợ', value: fmt(pendingTotal), color: 'danger' },
                    { label: 'Chưa thanh toán', value: invoices.filter(i => i.status === 'unpaid').length + ' hóa đơn', color: 'warning' },
                    { label: 'Đặt cọc', value: invoices.filter(i => i.status === 'partial').length + ' hóa đơn', color: 'info' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
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
                            <Form.Control placeholder="Tìm theo tên, mã booking, SĐT..." value={search} onChange={e => setSearch(e.target.value)} />
                        </InputGroup></Col>
                        <Col md={5}><Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="unpaid">Chưa thanh toán</option>
                            <option value="partial">Đặt cọc</option>
                            <option value="paid">Đã thanh toán</option>
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
                                    <th>Mã HĐ</th><th>Khách hàng</th><th>Sân / Giờ</th>
                                    <th>Tổng tiền</th><th>Đã trả</th><th>Còn lại</th>
                                    <th>TT</th><th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="align-middle"><strong>{inv.id}</strong><br /><small className="text-muted">{inv.bookingId}</small></td>
                                        <td className="align-middle"><div>{inv.customer}</div><small className="text-muted">{inv.phone}</small></td>
                                        <td className="align-middle"><div>{inv.court}</div><small className="text-muted">{inv.timeSlot}</small></td>
                                        <td className="align-middle fw-bold">{fmt(inv.totalAmount)}</td>
                                        <td className="align-middle text-success">{fmt(inv.paid)}</td>
                                        <td className="align-middle text-danger fw-bold">{fmt(inv.remaining)}</td>
                                        <td className="align-middle"><Badge bg={statusMap[inv.status].color}>{statusMap[inv.status].label}</Badge></td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-1">
                                                {inv.status !== 'paid' && (
                                                    <Button size="sm" variant="success" onClick={() => openPay(inv)}>
                                                        <BiDollar /> Thu tiền
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
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Thu tiền — {selected?.customer}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selected && (
                        <>
                            <div className="bg-light rounded p-3 mb-3 small">
                                <Row><Col><strong>Sân:</strong> {selected.court}</Col><Col><strong>Giờ:</strong> {selected.timeSlot}</Col></Row>
                                <Row className="mt-1"><Col><strong>Tổng:</strong> {fmt(selected.totalAmount)}</Col><Col><strong>Đã trả:</strong> {fmt(selected.paid)}</Col></Row>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Phương thức thanh toán</Form.Label>
                                <div className="d-flex gap-2">
                                    {[['cash', <><BiMoney /> Tiền mặt</>], ['card', <><BiCreditCard /> Thẻ</>], ['transfer', <>📱 QR / CK</>]].map(([val, label]) => (
                                        <Button key={val} variant={payForm.method === val ? 'primary' : 'outline-secondary'}
                                            className="flex-grow-1" onClick={() => setPayForm({ ...payForm, method: val })}>
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số tiền thu (VND)</Form.Label>
                                <Form.Control type="number" value={payForm.amount}
                                    onChange={e => setPayForm({ ...payForm, amount: +e.target.value })}
                                    min={0} max={selected.remaining} />
                                <Form.Text className="text-muted">Còn nợ: {fmt(selected.remaining)}</Form.Text>
                            </Form.Group>
                            <div className="d-flex justify-content-between p-3 bg-success bg-opacity-10 rounded">
                                <span>Thu:</span><strong className="text-success fs-5">{fmt(payForm.amount)}</strong>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="success" onClick={handlePay} disabled={!payForm.amount || payForm.amount <= 0}>
                        <BiCheck className="me-2" />Xác nhận thu tiền
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CounterPayments;
