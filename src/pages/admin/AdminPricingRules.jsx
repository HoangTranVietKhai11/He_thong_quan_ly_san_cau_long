import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { BiDollarCircle, BiPlus, BiTrash, BiEdit, BiSave, BiCalendarEvent } from 'react-icons/bi';
import advancedService from '../../services/advancedService';
import courtService from '../../services/courtService';

const AdminPricingRules = () => {
    const [rules, setRules] = useState([]);
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        court_id: '',
        day_of_week: '*',
        start_time: '17:00',
        end_time: '21:00',
        price_multiplier: 1.2,
        is_active: 1,
        priority: 1,
        description: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const rulesRes = await advancedService.getPricingRules();
            setRules(rulesRes.data.data || []);
            const courtsRes = await courtService.getCourts();
            const list = Array.isArray(courtsRes.data) ? courtsRes.data : courtsRes.data?.courts || [];
            setCourts(list);
            if (list.length > 0) setForm(f => ({ ...f, court_id: list[0].id }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await advancedService.createPricingRule({
                ...form,
                start_time: form.start_time.includes(':') ? `${form.start_time}:00` : form.start_time,
                end_time: form.end_time.includes(':') ? `${form.end_time}:00` : form.end_time,
            });
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi lưu quy tắc');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa quy tắc này?')) return;
        try {
            await advancedService.deletePricingRule(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi xóa');
        }
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiDollarCircle className="me-2 text-success" />Cấu hình giá động</h2>
                    <p className="text-muted mb-0">Thiết lập giờ cao điểm, ngày lễ và hệ số nhân giá tự động</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <BiPlus className="me-2" />Thêm quy tắc mới
                </Button>
            </div>

            <Row>
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Sân áp dụng</th>
                                        <th>Thời gian / Thứ</th>
                                        <th>Hệ số giá</th>
                                        <th>Mô tả</th>
                                        <th>Trạng thái</th>
                                        <th className="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rules.map(rule => (
                                        <tr key={rule.id}>
                                            <td>
                                                <Badge bg="info" className="p-2">
                                                    {rule.court_id ? (courts.find(c => c.id == rule.court_id)?.name || rule.court_id) : 'Tất cả các sân'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-primary">{rule.start_time.substring(0,5)} – {rule.end_time.substring(0,5)}</div>
                                                <div className="small text-muted">
                                                    {rule.day_of_week === '*' ? 'Mọi ngày' : `Thứ: ${rule.day_of_week}`}
                                                </div>
                                            </td>
                                            <td>
                                                <strong className="text-success">x{rule.price_multiplier}</strong>
                                            </td>
                                            <td><small>{rule.description || '—'}</small></td>
                                            <td>
                                                <Badge bg={rule.is_active ? 'success' : 'secondary'}>
                                                    {rule.is_active ? 'Đang bật' : 'Đã tắt'}
                                                </Badge>
                                            </td>
                                            <td className="text-end">
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(rule.id)}>
                                                    <BiTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rules.length === 0 && (
                                        <tr><td colSpan="6" className="text-center py-5 text-muted">Chưa có quy tắc giá nào được thiết lập</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="fw-bold">Thêm quy tắc giá động</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label>Sân áp dụng</Form.Label>
                                <Form.Select value={form.court_id} onChange={e => setForm({...form, court_id: e.target.value})}>
                                    <option value="">Tất cả các sân</option>
                                    {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Thứ trong tuần (Dấu * cho tất cả)</Form.Label>
                                <Form.Control value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})} placeholder="VD: 1,3,5 hoặc *" />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Bắt đầu (HH:mm)</Form.Label>
                                <Form.Control value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Kết thúc (HH:mm)</Form.Label>
                                <Form.Control value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Hệ số giá (VD: 1.2 = +20%)</Form.Label>
                                <Form.Control type="number" step="0.1" value={form.price_multiplier} 
                                    onChange={e => setForm({...form, price_multiplier: +e.target.value})} />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Mô tả quy tắc</Form.Label>
                                <Form.Control value={form.description} onChange={e => setForm({...form, description: e.target.value})} 
                                    placeholder="VD: Giờ cao điểm buổi tối các ngày trong tuần" />
                            </Col>
                        </Row>
                        <hr />
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button variant="primary" type="submit" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : <BiSave className="me-2" />}Lưu quy tắc
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminPricingRules;
