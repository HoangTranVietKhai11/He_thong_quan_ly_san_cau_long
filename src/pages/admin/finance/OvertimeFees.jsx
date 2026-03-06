import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, Alert } from 'react-bootstrap';
import { BiBookmarkAlt, BiStopwatch } from 'react-icons/bi';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const OvertimeFees = () => {
    const [config, setConfig] = useState({
        freeMinutes: 5,
        pricePerMinute: 3000,
        maxOvertimeMinutes: 60,
        autoCharge: true,
        notifyStaff: true,
    });
    const [saved, setSaved] = useState(false);

    const mockRecords = [
        { id: 1, bookingId: 'BK-001', customer: 'Nguyễn Văn A', court: 'Sân 3', date: '2026-03-03', booked: '17:00-19:00', actual: '19:12', overtime: 12, fee: 36000, status: 'charged' },
        { id: 2, bookingId: 'BK-007', customer: 'Trần Thị B', court: 'Sân 1', date: '2026-03-03', booked: '08:00-10:00', actual: '10:08', overtime: 8, fee: 24000, status: 'charged' },
        { id: 3, bookingId: 'BK-012', customer: 'Lê Văn C', court: 'Sân 5', date: '2026-03-02', booked: '19:00-21:00', actual: '21:25', overtime: 25, fee: 75000, status: 'pending' },
        { id: 4, bookingId: 'BK-015', customer: 'Phạm Minh D', court: 'Sân 2', date: '2026-03-02', booked: '14:00-16:00', actual: '16:02', overtime: 2, fee: 0, status: 'free' },
    ];

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiStopwatch className="me-2 text-warning" />Phí quá giờ</h2>
                    <p className="text-muted mb-0">Cấu hình và theo dõi phí phát sinh khi khách dùng quá giờ</p>
                </div>
                <Button variant="primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
                    <BiBookmarkAlt className="me-2" />Lưu cấu hình
                </Button>
            </div>

            {saved && <Alert variant="success" className="mb-3">✅ Đã lưu cấu hình phí quá giờ!</Alert>}

            <Row className="g-4 mb-4">
                <Col md={5}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white fw-bold">Cấu hình tính phí</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Số phút miễn phí (buffer): <strong>{config.freeMinutes} phút</strong></Form.Label>
                                <Form.Range min={0} max={15} value={config.freeMinutes}
                                    onChange={e => setConfig({ ...config, freeMinutes: +e.target.value })} />
                                <Form.Text className="text-muted">Dưới {config.freeMinutes} phút sẽ không tính phí</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giá/phút quá giờ</Form.Label>
                                <Form.Select value={config.pricePerMinute}
                                    onChange={e => setConfig({ ...config, pricePerMinute: +e.target.value })}>
                                    <option value={2000}>2.000 đ/phút (120.000 đ/giờ)</option>
                                    <option value={3000}>3.000 đ/phút (180.000 đ/giờ)</option>
                                    <option value={4000}>4.000 đ/phút (240.000 đ/giờ)</option>
                                    <option value={5000}>5.000 đ/phút (300.000 đ/giờ)</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quá giờ tối đa: <strong>{config.maxOvertimeMinutes} phút</strong></Form.Label>
                                <Form.Range min={30} max={120} step={15} value={config.maxOvertimeMinutes}
                                    onChange={e => setConfig({ ...config, maxOvertimeMinutes: +e.target.value })} />
                            </Form.Group>
                            <Form.Check type="switch" id="auto" className="mb-2"
                                label="Tự động tính phí vào hóa đơn"
                                checked={config.autoCharge}
                                onChange={e => setConfig({ ...config, autoCharge: e.target.checked })} />
                            <Form.Check type="switch" id="notify"
                                label="Thông báo cho nhân viên khi quá giờ"
                                checked={config.notifyStaff}
                                onChange={e => setConfig({ ...config, notifyStaff: e.target.checked })} />

                            <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded small">
                                <strong>Ví dụ:</strong> Quá {config.freeMinutes + 1} phút → tính {fmt(config.pricePerMinute * (config.freeMinutes + 1))}<br />
                                Quá 30 phút → tính {fmt(config.pricePerMinute * 30)}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white fw-bold">Lịch sử quá giờ gần đây</Card.Header>
                        <Card.Body className="p-0">
                            <Table hover className="mb-0 small">
                                <thead className="bg-light">
                                    <tr><th>Booking</th><th>Khách</th><th>Sân/Ngày</th><th>Giờ đặt</th><th>Thực tế out</th><th>Quá</th><th>Phí</th><th>TT</th></tr>
                                </thead>
                                <tbody>
                                    {mockRecords.map(r => (
                                        <tr key={r.id}>
                                            <td className="align-middle"><strong>{r.bookingId}</strong></td>
                                            <td className="align-middle">{r.customer}</td>
                                            <td className="align-middle">{r.court}<br /><small className="text-muted">{r.date}</small></td>
                                            <td className="align-middle">{r.booked}</td>
                                            <td className="align-middle">{r.actual}</td>
                                            <td className="align-middle"><Badge bg={r.overtime > config.freeMinutes ? 'danger' : 'success'}>{r.overtime} phút</Badge></td>
                                            <td className="align-middle text-danger fw-bold">{r.fee > 0 ? fmt(r.fee) : '—'}</td>
                                            <td className="align-middle">
                                                <Badge bg={r.status === 'charged' ? 'success' : r.status === 'pending' ? 'warning' : 'secondary'}>
                                                    {r.status === 'charged' ? 'Đã thu' : r.status === 'pending' ? 'Chờ' : 'Miễn'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OvertimeFees;
