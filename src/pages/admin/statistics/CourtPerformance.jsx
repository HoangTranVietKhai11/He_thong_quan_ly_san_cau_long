import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Nav, Form, ProgressBar } from 'react-bootstrap';
import { BiAward, BiTrendingUp, BiTrendingDown } from 'react-icons/bi';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const courts = [
    { id: 1, name: 'Sân 1', type: 'Standard', bookings: 98, revenue: 21600000, avgDuration: 1.5, peakHour: '18:00', rating: 4.3, cancellations: 8, issues: 2 },
    { id: 2, name: 'Sân 2', type: 'Standard', bookings: 87, revenue: 19200000, avgDuration: 1.8, peakHour: '17:00', rating: 4.1, cancellations: 6, issues: 1 },
    { id: 3, name: 'Sân 3', type: 'VIP', bookings: 112, revenue: 34800000, avgDuration: 2.0, peakHour: '19:00', rating: 4.8, cancellations: 4, issues: 0 },
    { id: 4, name: 'Sân 4', type: 'Double', bookings: 76, revenue: 16800000, avgDuration: 1.3, peakHour: '20:00', rating: 4.0, cancellations: 10, issues: 3 },
    { id: 5, name: 'Sân 5', type: 'Standard', bookings: 95, revenue: 21000000, avgDuration: 1.6, peakHour: '17:00', rating: 4.5, cancellations: 7, issues: 1 },
    { id: 6, name: 'Sân 6', type: 'VIP', bookings: 108, revenue: 33600000, avgDuration: 1.9, peakHour: '18:00', rating: 4.7, cancellations: 3, issues: 0 },
    { id: 7, name: 'Sân 7', type: 'Standard', bookings: 72, revenue: 15840000, avgDuration: 1.2, peakHour: '16:00', rating: 3.9, cancellations: 12, issues: 4 },
    { id: 8, name: 'Sân 8', type: 'Standard', bookings: 89, revenue: 19560000, avgDuration: 1.7, peakHour: '17:00', rating: 4.2, cancellations: 5, issues: 1 },
];

const maxRevenue = Math.max(...courts.map(c => c.revenue));

const CourtPerformance = () => {
    const [sortBy, setSortBy] = useState('revenue');
    const [activeTab, setActiveTab] = useState('overview');

    const sorted = [...courts].sort((a, b) => {
        if (sortBy === 'revenue') return b.revenue - a.revenue;
        if (sortBy === 'bookings') return b.bookings - a.bookings;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiAward className="me-2 text-warning" />Hiệu suất sân</h2>
                    <p className="text-muted mb-0">Phân tích và xếp hạng hiệu suất hoạt động từng sân</p>
                </div>
                <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 180 }}>
                    <option value="revenue">Sắp theo doanh thu</option>
                    <option value="bookings">Sắp theo lượt đặt</option>
                    <option value="rating">Sắp theo đánh giá</option>
                </Form.Select>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                    <Nav variant="tabs">
                        {[['overview', 'Tổng quan'], ['detail', 'Chi tiết']].map(([k, l]) => (
                            <Nav.Item key={k}><Nav.Link active={activeTab === k} onClick={() => setActiveTab(k)}>{l}</Nav.Link></Nav.Item>
                        ))}
                    </Nav>
                </Card.Header>
                <Card.Body>
                    {activeTab === 'overview' && (
                        <Row className="g-3">
                            {sorted.map((c, i) => (
                                <Col md={3} key={c.id}>
                                    <Card className={`h-100 border ${c.issues > 2 ? 'border-danger' : 'border-0'} shadow-sm`}>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="fw-bold mb-0">{c.name}</h6>
                                                    <Badge bg={c.type === 'VIP' ? 'warning' : c.type === 'Double' ? 'info' : 'secondary'} style={{ fontSize: '0.65rem' }}>{c.type}</Badge>
                                                </div>
                                                <span className="fw-bold text-warning" title="Xếp hạng">#{i + 1}</span>
                                            </div>

                                            {/* Revenue Bar */}
                                            <div className="mb-2">
                                                <div className="d-flex justify-content-between small mb-1">
                                                    <span className="text-muted">Doanh thu</span>
                                                    <strong className="text-success">{fmt(c.revenue)}</strong>
                                                </div>
                                                <div style={{ height: 8, background: '#e9ecef', borderRadius: 4 }}>
                                                    <div style={{ width: `${c.revenue / maxRevenue * 100}%`, height: 8, background: '#0d6efd', borderRadius: 4 }} />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between small text-muted">
                                                <span>⭐ {c.rating}</span>
                                                <span>📅 {c.bookings} lượt</span>
                                                <span>⏱ {c.avgDuration}h TB</span>
                                            </div>

                                            {c.issues > 0 && (
                                                <div className="mt-2 small text-danger">⚠️ {c.issues} sự cố</div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {activeTab === 'detail' && (
                        <div className="table-responsive">
                            <Table hover className="mb-0 small">
                                <thead className="bg-light">
                                    <tr><th>#</th><th>Sân</th><th>Loại</th><th>Lượt đặt</th><th>Doanh thu</th><th>TB/lượt</th><th>Đánh giá</th><th>Hủy</th><th>Sự cố</th><th>Giờ peak</th></tr>
                                </thead>
                                <tbody>
                                    {sorted.map((c, i) => (
                                        <tr key={c.id}>
                                            <td className="fw-bold">{i + 1}</td>
                                            <td className="fw-bold">{c.name}</td>
                                            <td><Badge bg={c.type === 'VIP' ? 'warning' : 'secondary'}>{c.type}</Badge></td>
                                            <td>{c.bookings}</td>
                                            <td className="text-success fw-bold">{fmt(c.revenue)}</td>
                                            <td>{fmt(Math.round(c.revenue / c.bookings))}</td>
                                            <td>
                                                <span className="text-warning">{'★'.repeat(Math.round(c.rating))}</span>
                                                <span className="text-muted">{'★'.repeat(5 - Math.round(c.rating))}</span>
                                                <span className="ms-1 small">{c.rating}</span>
                                            </td>
                                            <td><Badge bg={c.cancellations > 8 ? 'danger' : 'warning'}>{c.cancellations}</Badge></td>
                                            <td><Badge bg={c.issues > 2 ? 'danger' : c.issues > 0 ? 'warning' : 'success'}>{c.issues}</Badge></td>
                                            <td>{c.peakHour}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourtPerformance;
