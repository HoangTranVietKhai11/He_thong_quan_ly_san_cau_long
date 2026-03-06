import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form } from 'react-bootstrap';
import { BiPieChart, BiCalendar } from 'react-icons/bi';

const courts = [
    { id: 1, name: 'Sân 1', totalHours: 476, usedHours: 372, revenue: 44640000 },
    { id: 2, name: 'Sân 2', totalHours: 476, usedHours: 333, revenue: 39960000 },
    { id: 3, name: 'Sân 3 (VIP)', totalHours: 476, usedHours: 428, revenue: 68480000 },
    { id: 4, name: 'Sân 4', totalHours: 476, usedHours: 295, revenue: 35400000 },
    { id: 5, name: 'Sân 5', totalHours: 476, usedHours: 362, revenue: 43440000 },
    { id: 6, name: 'Sân 6 (VIP)', totalHours: 476, usedHours: 381, revenue: 60960000 },
    { id: 7, name: 'Sân 7', totalHours: 476, usedHours: 248, revenue: 29760000 },
    { id: 8, name: 'Sân 8', totalHours: 476, usedHours: 319, revenue: 38280000 },
];

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const OccupancyStats = () => {
    const [period, setPeriod] = useState('month');

    const totalUsed = courts.reduce((s, c) => s + c.usedHours, 0);
    const totalAvail = courts.reduce((s, c) => s + c.totalHours, 0);
    const avgOccupancy = Math.round(totalUsed / totalAvail * 100);
    const totalRevenue = courts.reduce((s, c) => s + c.revenue, 0);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiPieChart className="me-2 text-info" />Tỷ lệ sử dụng sân (Occupancy)</h2>
                    <p className="text-muted mb-0">Theo dõi mức độ sử dụng từng sân theo thời gian</p>
                </div>
                <Form.Select value={period} onChange={e => setPeriod(e.target.value)} style={{ width: 160 }}>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                </Form.Select>
            </div>

            <Row className="mb-4 g-3">
                {[
                    { label: 'Occupancy TB', value: `${avgOccupancy}%`, sub: 'Tất cả sân', color: avgOccupancy > 75 ? 'success' : avgOccupancy > 50 ? 'warning' : 'danger' },
                    { label: 'Sân cao nhất', value: `Sân 3 — ${Math.round(428/476*100)}%`, sub: '428/476 giờ', color: 'success' },
                    { label: 'Sân thấp nhất', value: `Sân 7 — ${Math.round(248/476*100)}%`, sub: '248/476 giờ', color: 'warning' },
                    { label: 'Tổng doanh thu', value: fmt(totalRevenue), sub: 'Tháng này', color: 'primary' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold`}>{s.label}</div>
                                <h4 className="fw-bold mb-0">{s.value}</h4>
                                <small className="text-muted">{s.sub}</small>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Visual Occupancy Grid */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white fw-bold">Mức độ sử dụng từng sân</Card.Header>
                <Card.Body>
                    {courts.map(c => {
                        const pct = Math.round(c.usedHours / c.totalHours * 100);
                        return (
                            <div key={c.id} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1 small">
                                    <span className="fw-bold">{c.name}</span>
                                    <span className="text-muted">{c.usedHours}h / {c.totalHours}h</span>
                                    <Badge bg={pct > 80 ? 'success' : pct > 60 ? 'warning' : 'danger'}>{pct}%</Badge>
                                </div>
                                <div style={{ height: 16, background: '#e9ecef', borderRadius: 8 }}>
                                    <div style={{
                                        width: `${pct}%`, height: 16, borderRadius: 8,
                                        background: pct > 80 ? 'linear-gradient(to right, #198754, #75b798)' :
                                            pct > 60 ? 'linear-gradient(to right, #ffc107, #ffda6a)' :
                                                'linear-gradient(to right, #dc3545, #ea868f)',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white fw-bold">Bảng chi tiết</Card.Header>
                <Card.Body className="p-0">
                    <Table hover className="mb-0 small">
                        <thead className="bg-light">
                            <tr><th>Sân</th><th>Giờ hoạt động</th><th>Giờ đã dùng</th><th>Giờ trống</th><th>Occupancy</th><th>Doanh thu</th></tr>
                        </thead>
                        <tbody>
                            {courts.sort((a, b) => b.usedHours / b.totalHours - a.usedHours / a.totalHours).map(c => {
                                const pct = Math.round(c.usedHours / c.totalHours * 100);
                                return (
                                    <tr key={c.id}>
                                        <td className="fw-bold">{c.name}</td>
                                        <td>{c.totalHours}h</td>
                                        <td className="text-success">{c.usedHours}h</td>
                                        <td className="text-muted">{c.totalHours - c.usedHours}h</td>
                                        <td><Badge bg={pct > 80 ? 'success' : pct > 60 ? 'warning' : 'danger'}>{pct}%</Badge></td>
                                        <td className="text-success fw-bold">{fmt(c.revenue)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OccupancyStats;
