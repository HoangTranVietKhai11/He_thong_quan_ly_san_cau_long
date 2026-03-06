import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Table } from 'react-bootstrap';
import { BiTime, BiUser, BiPlus, BiTrash, BiBell } from 'react-icons/bi';

const courts = [
    { id: 1, name: 'Sân 1' }, { id: 2, name: 'Sân 2' }, { id: 3, name: 'Sân 3 (VIP)' },
    { id: 4, name: 'Sân 4' }, { id: 5, name: 'Sân 5' },
];

const priceByHour = (h) => h >= 17 && h < 21 ? 170000 : 120000;
const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const today = new Date().toISOString().split('T')[0];

const mockWaitlist = [
    { id: 1, date: today, hour: 17, courtId: 3, name: 'Trần Thị B', phone: '0902345678', status: 'waiting', createdAt: '2026-03-03 19:00' },
    { id: 2, date: today, hour: 19, courtId: 1, name: 'Lê Văn C', phone: '0903456789', status: 'notified', createdAt: '2026-03-03 18:30' },
    { id: 3, date: today, hour: 18, courtId: 2, name: 'Phạm Thị D', phone: '0904567890', status: 'expired', createdAt: '2026-03-03 15:00' },
];

const WaitlistBooking = () => {
    const [form, setForm] = useState({ date: today, hour: 17, courtId: 1, name: '', phone: '' });
    const [waitlist, setWaitlist] = useState(mockWaitlist);
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            ...form,
            status: 'waiting',
            createdAt: new Date().toLocaleString('vi-VN'),
        };
        setWaitlist([newItem, ...waitlist]);
        setAdded(true);
        setForm({ date: today, hour: 17, courtId: 1, name: '', phone: '' });
        setTimeout(() => setAdded(false), 4000);
    };

    const handleRemove = (id) => {
        setWaitlist(waitlist.filter(w => w.id !== id));
    };

    const statusInfo = {
        waiting: { label: 'Đang chờ', color: 'warning', icon: '⏳' },
        notified: { label: 'Đã thông báo', color: 'success', icon: '🔔' },
        expired: { label: 'Hết hạn', color: 'secondary', icon: '⏰' },
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiTime className="me-2 text-warning" />Đăng ký chờ sân</h2>
                    <p className="text-muted mb-0">Đăng ký vào danh sách chờ khi khung giờ bạn muốn đã đầy</p>
                </div>
            </div>

            {added && <Alert variant="success" dismissible onClose={() => setAdded(false)}>
                <BiBell className="me-2" /><strong>Đăng ký thành công!</strong> Chúng tôi sẽ thông báo ngay khi có chỗ trống.
            </Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Đang chờ', value: waitlist.filter(w => w.status === 'waiting').length, color: 'warning' },
                    { label: 'Đã thông báo', value: waitlist.filter(w => w.status === 'notified').length, color: 'success' },
                    { label: 'Hết hạn', value: waitlist.filter(w => w.status === 'expired').length, color: 'secondary' },
                ].map((s, i) => (
                    <Col md={4} key={i}>
                        <Card className={`border-0 shadow-sm border-start border-${s.color} border-4`}>
                            <Card.Body className="py-3">
                                <div className={`text-${s.color} small fw-bold`}>{s.label}</div>
                                <h3 className="fw-bold mb-0">{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col md={5}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold"><BiPlus className="me-2 text-primary" />Đăng ký chờ mới</Card.Header>
                        <Card.Body>
                            <Alert variant="info" className="small">
                                ℹ️ Khi có người hủy sân, hệ thống sẽ <strong>tự động gửi thông báo</strong> theo thứ tự đăng ký. Bạn có <strong>30 phút</strong> để xác nhận.
                            </Alert>
                            <Form onSubmit={handleAdd}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày muốn chơi</Form.Label>
                                    <Form.Control type="date" min={today} value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })} required />
                                </Form.Group>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Label>Khung giờ</Form.Label>
                                        <Form.Select value={form.hour} onChange={e => setForm({ ...form, hour: +e.target.value })}>
                                            {Array.from({ length: 17 }, (_, i) => i + 6).map(h => (
                                                <option key={h} value={h}>{h}:00 – {h + 1}:00 ({fmt(priceByHour(h))})</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>Sân mong muốn</Form.Label>
                                        <Form.Select value={form.courtId} onChange={e => setForm({ ...form, courtId: +e.target.value })}>
                                            <option value="">Bất kỳ sân nào</option>
                                            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label><BiUser className="me-1" />Họ tên <span className="text-danger">*</span></Form.Label>
                                    <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Nguyễn Văn A" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số điện thoại nhận thông báo <span className="text-danger">*</span></Form.Label>
                                    <Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="09xxxxxxxx" required />
                                </Form.Group>
                                <Button type="submit" variant="warning" className="w-100 text-dark fw-bold">
                                    <BiTime className="me-2" />Đăng ký vào danh sách chờ
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Danh sách đăng ký chờ ({waitlist.length})</Card.Header>
                        <Card.Body className="p-0">
                            {waitlist.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <BiTime size={48} className="mb-3 opacity-25" />
                                    <p>Không có đăng ký chờ nào</p>
                                </div>
                            ) : (
                                <Table hover className="mb-0 small">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Ngày / Giờ</th>
                                            <th>Sân</th>
                                            <th>Khách</th>
                                            <th>Trạng thái</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitlist.map(item => {
                                            const info = statusInfo[item.status];
                                            return (
                                                <tr key={item.id}>
                                                    <td className="align-middle">
                                                        <div className="fw-bold">{new Date(item.date).toLocaleDateString('vi-VN')}</div>
                                                        <div className="text-muted">{item.hour}:00 – {item.hour + 1}:00</div>
                                                    </td>
                                                    <td className="align-middle">{courts.find(c => c.id === item.courtId)?.name || 'Bất kỳ'}</td>
                                                    <td className="align-middle">
                                                        <div>{item.name}</div>
                                                        <div className="text-muted">{item.phone}</div>
                                                    </td>
                                                    <td className="align-middle">
                                                        <Badge bg={info.color}>
                                                            {info.icon} {info.label}
                                                        </Badge>
                                                        {item.status === 'notified' && (
                                                            <div className="text-success small mt-1">Đang chờ xác nhận...</div>
                                                        )}
                                                    </td>
                                                    <td className="align-middle text-end">
                                                        {item.status === 'waiting' && (
                                                            <Button size="sm" variant="outline-danger" onClick={() => handleRemove(item.id)}>
                                                                <BiTrash />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WaitlistBooking;
