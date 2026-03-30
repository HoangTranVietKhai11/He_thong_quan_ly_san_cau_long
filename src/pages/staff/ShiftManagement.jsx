import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { BiTime, BiCalculator, BiCheck, BiExit, BiHistory } from 'react-icons/bi';
import staffOpsService from '../../services/staffOpsService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeShift, setActiveShift] = useState(null);
    const [showEndModal, setShowEndModal] = useState(false);
    const [endForm, setEndForm] = useState({ actual_cash: 0, notes: '' });
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await staffOpsService.getMyShifts();
            const data = res.data || [];
            setShifts(data);
            const active = data.find(s => s.status === 'Open');
            setActiveShift(active || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleStart = async () => {
        try {
            const startCash = prompt('Nhập số tiền mặt đầu ca (VNĐ):', '0');
            if (startCash === null) return;
            await staffOpsService.startShift({ start_cash: parseFloat(startCash) || 0 });
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi mở ca');
        }
    };

    const handleEnd = async () => {
        setSubmitting(true);
        try {
            await staffOpsService.endShift({
                shift_id: activeShift.id,
                end_cash: endForm.actual_cash,
                notes: endForm.notes
            });
            setShowEndModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi chốt ca');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiTime className="me-2 text-primary" />Quản lý ca làm việc</h2>
                    <p className="text-muted mb-0">Theo dõi thời gian làm việc và đối soát doanh thu tiền mặt</p>
                </div>
                {!activeShift ? (
                    <Button variant="primary" size="lg" onClick={handleStart} className="shadow-sm">
                        <BiCheck className="me-2" />Bắt đầu ca mới
                    </Button>
                ) : (
                    <Button variant="danger" size="lg" onClick={() => setShowEndModal(true)} className="shadow-sm">
                        <BiExit className="me-2" />Kết thúc ca làm việc
                    </Button>
                )}
            </div>

            {activeShift && (
                <Card className="border-0 shadow-sm mb-4 bg-primary text-white">
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={3}>
                                <div className="small opacity-75">Ca đang hoạt động</div>
                                <h4 className="fw-bold mb-0">#{activeShift.id}</h4>
                            </Col>
                            <Col md={3}>
                                <div className="small opacity-75">Bắt đầu lúc</div>
                                <div className="fw-bold">{new Date(activeShift.start_time).toLocaleString('vi-VN')}</div>
                            </Col>
                            <Col md={3}>
                                <div className="small opacity-75">Tiền mặt đầu ca</div>
                                <div className="fw-bold">{fmt(activeShift.start_cash)}</div>
                            </Col>
                            <Col md={3} className="text-end">
                                <Badge bg="light" text="primary" className="p-2 px-3">Đang mở</Badge>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white fw-bold"><BiHistory className="me-2" />Lịch sử ca làm việc</Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Mã ca</th>
                                <th>Thời gian</th>
                                <th>Tiền mặt (Đầu/Cuối)</th>
                                <th>Chênh lệch</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shifts.map(s => {
                                const endCash = parseFloat(s.end_cash) || 0;
                                const startCash = parseFloat(s.start_cash) || 0;
                                const diff = endCash - startCash;
                                return (
                                    <tr key={s.id}>
                                        <td className="fw-bold">#{s.id}</td>
                                        <td>
                                            <div className="small">Bắt đầu: {s.start_time ? new Date(s.start_time).toLocaleString('vi-VN') : '—'}</div>
                                            {s.end_time && <div className="small text-muted">Kết thúc: {new Date(s.end_time).toLocaleString('vi-VN')}</div>}
                                        </td>
                                        <td>
                                            <div className="small text-primary">Đầu: {fmt(s.start_cash || 0)}</div>
                                            {s.end_time && <div className="small text-success">Cuối: {fmt(s.end_cash || 0)}</div>}
                                        </td>
                                        <td>
                                            {s.status === 'Closed' ? (
                                                <Badge bg={diff === 0 ? 'success' : 'danger'}>
                                                    {diff > 0 ? '+' : ''}{fmt(diff)}
                                                </Badge>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            <Badge bg={s.status === 'Open' ? 'warning' : 'secondary'}>
                                                {s.status === 'Open' ? 'Đang mở' : 'Đã chốt'}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* End Shift Modal */}
            <Modal show={showEndModal} onHide={() => setShowEndModal(false)} centered>
                <Modal.Header closeButton className="fw-bold">Kết thúc ca & Đối soát tiền mặt</Modal.Header>
                <Modal.Body>
                    <Alert variant="warning" className="small">
                        <BiCalculator className="me-2" />Vui lòng kiểm kê số tiền mặt hiện có trong két trước khi chốt ca.
                    </Alert>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tổng tiền mặt cuối ca (VNĐ)</Form.Label>
                            <Form.Control type="number" value={endForm.actual_cash} 
                                onChange={e => setEndForm({...endForm, actual_cash: +e.target.value})}
                                className="form-control-lg text-primary fw-bold" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú / Lý do chênh lệch (nếu có)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={endForm.notes}
                                onChange={e => setEndForm({...endForm, notes: e.target.value})}
                                placeholder="VD: Khách trả thừa tiền không lấy lại..." />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEndModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleEnd} disabled={submitting}>
                        {submitting ? <Spinner size="sm" /> : 'Xác nhận chốt ca'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ShiftManagement;
