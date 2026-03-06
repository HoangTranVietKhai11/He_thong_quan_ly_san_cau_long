import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button } from 'react-bootstrap';
import { BiDownload, BiTrendingUp, BiCalendar, BiMoney } from 'react-icons/bi';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const monthlyData = [
    { month: 'T10/2025', bookings: 312, revenue: 87600000, expenses: 12000000, profit: 75600000 },
    { month: 'T11/2025', bookings: 345, revenue: 96000000, expenses: 13500000, profit: 82500000 },
    { month: 'T12/2025', bookings: 398, revenue: 115200000, expenses: 14200000, profit: 101000000 },
    { month: 'T1/2026', bookings: 342, revenue: 98400000, expenses: 13000000, profit: 85400000 },
    { month: 'T2/2026', bookings: 289, revenue: 79200000, expenses: 11800000, profit: 67400000 },
    { month: 'T3/2026', bookings: 178, revenue: 52800000, expenses: 10000000, profit: 42800000 },
];

const courtRevenue = [
    { court: 'Sân 1', bookings: 98, revenue: 21600000, occupancy: 78 },
    { court: 'Sân 2', bookings: 87, revenue: 19200000, occupancy: 70 },
    { court: 'Sân 3 (VIP)', bookings: 112, revenue: 34800000, occupancy: 90 },
    { court: 'Sân 4', bookings: 76, revenue: 16800000, occupancy: 62 },
    { court: 'Sân 5', bookings: 95, revenue: 21000000, occupancy: 76 },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

const RevenueReports = () => {
    const [period, setPeriod] = useState('6months');

    const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
    const totalProfit = monthlyData.reduce((s, d) => s + d.profit, 0);
    const totalBookings = monthlyData.reduce((s, d) => s + d.bookings, 0);
    const avgMonthly = totalRevenue / monthlyData.length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiTrendingUp className="me-2 text-success" />Báo cáo doanh thu</h2>
                    <p className="text-muted mb-0">Tổng quan thu nhập và lợi nhuận theo thời gian</p>
                </div>
                <div className="d-flex gap-2">
                    <Form.Select value={period} onChange={e => setPeriod(e.target.value)} style={{ width: 160 }}>
                        <option value="3months">3 tháng</option>
                        <option value="6months">6 tháng</option>
                        <option value="year">Năm nay</option>
                    </Form.Select>
                    <Button variant="outline-primary"><BiDownload className="me-1" />Xuất Excel</Button>
                </div>
            </div>

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng doanh thu', value: fmt(totalRevenue), color: 'success', icon: <BiMoney /> },
                    { label: 'Lợi nhuận ròng', value: fmt(totalProfit), color: 'primary', icon: <BiTrendingUp /> },
                    { label: 'Tổng lượt đặt', value: totalBookings.toLocaleString(), color: 'info', icon: <BiCalendar /> },
                    { label: 'TB/tháng', value: fmt(avgMonthly), color: 'warning', icon: <BiMoney /> },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body><div className={`text-${s.color} mb-1`}>{s.icon}</div>
                                <div className="small text-muted">{s.label}</div>
                                <h4 className="fw-bold mb-0">{s.value}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Bar Chart (CSS-based) */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white fw-bold">Doanh thu theo tháng</Card.Header>
                <Card.Body>
                    <div className="d-flex align-items-end gap-3" style={{ height: 200 }}>
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-grow-1 text-center">
                                <div className="fw-bold small text-success mb-1">{fmt(d.revenue / 1000000).replace('₫', '').trim()}M</div>
                                <div style={{ height: `${(d.revenue / maxRevenue) * 160}px`, background: 'linear-gradient(to top, #0d6efd, #6ea8fe)', borderRadius: '6px 6px 0 0', transition: 'height 0.3s' }} title={fmt(d.revenue)} />
                                <div className="small text-muted mt-1">{d.month}</div>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4">
                <Col md={7}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Chi tiết theo tháng</Card.Header>
                        <Card.Body className="p-0">
                            <Table hover className="mb-0 small">
                                <thead className="bg-light">
                                    <tr><th>Tháng</th><th>Lượt đặt</th><th>Doanh thu</th><th>Chi phí</th><th>Lợi nhuận</th><th>Biên lợi nhuận</th></tr>
                                </thead>
                                <tbody>
                                    {monthlyData.map((d, i) => (
                                        <tr key={i}>
                                            <td className="fw-bold">{d.month}</td>
                                            <td>{d.bookings}</td>
                                            <td className="text-success fw-bold">{fmt(d.revenue)}</td>
                                            <td className="text-danger">{fmt(d.expenses)}</td>
                                            <td className="text-primary fw-bold">{fmt(d.profit)}</td>
                                            <td><Badge bg={d.profit / d.revenue > 0.8 ? 'success' : 'warning'}>{Math.round(d.profit / d.revenue * 100)}%</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Doanh thu theo sân</Card.Header>
                        <Card.Body className="p-0">
                            <Table hover className="mb-0 small">
                                <thead className="bg-light">
                                    <tr><th>Sân</th><th>Lượt</th><th>Doanh thu</th><th>Occupancy</th></tr>
                                </thead>
                                <tbody>
                                    {courtRevenue.map((c, i) => (
                                        <tr key={i}>
                                            <td className="fw-bold">{c.court}</td>
                                            <td>{c.bookings}</td>
                                            <td className="text-success">{fmt(c.revenue)}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div style={{ flex: 1, height: 8, background: '#e9ecef', borderRadius: 4 }}>
                                                        <div style={{ width: `${c.occupancy}%`, height: 8, background: c.occupancy > 80 ? '#198754' : c.occupancy > 60 ? '#ffc107' : '#dc3545', borderRadius: 4 }} />
                                                    </div>
                                                    <small>{c.occupancy}%</small>
                                                </div>
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

export default RevenueReports;
