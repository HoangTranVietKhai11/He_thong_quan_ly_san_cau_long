import React, { useState } from 'react';
import { Container, Card, Table, Row, Col, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { BiHistory, BiBarChart, BiFilterAlt, BiTrendingUp, BiMoney } from 'react-icons/bi';
import { FiDownload } from 'react-icons/fi';
import { mockCourtUsageHistory, mockUsageStats } from '../../../utils/mockAdminData';

const CourtUsageHistory = () => {
    const [history, setHistory] = useState(mockCourtUsageHistory);
    const [filterCourt, setFilterCourt] = useState('all');
    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
    const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

    const courts = ['all', ...new Set(mockCourtUsageHistory.map(h => h.courtName))];

    const filtered = history.filter(h => {
        const matchCourt = filterCourt === 'all' || h.courtName === filterCourt;
        const matchFrom = !filterFrom || h.date >= filterFrom;
        const matchTo = !filterTo || h.date <= filterTo;
        return matchCourt && matchFrom && matchTo;
    });

    const totalRevenue = filtered.reduce((s, h) => s + h.price, 0);
    const totalSessions = filtered.length;
    const avgPrice = totalSessions > 0 ? totalRevenue / totalSessions : 0;

    const getTypeColor = (type) => ({ VIP: 'warning', STANDARD: 'info', DOUBLE: 'success' }[type] || 'secondary');

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2"><BiHistory className="me-2 text-primary" />Lịch sử sử dụng sân</h2>
                    <p className="text-muted">Thống kê lịch sử và phân tích hiệu suất sử dụng sân</p>
                </div>
                <Button variant="outline-success">
                    <FiDownload className="me-2" />Xuất báo cáo
                </Button>
            </div>

            {/* Summary Stats */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Tổng lượt sử dụng</div>
                                    <h3 className="fw-bold mb-0">{mockUsageStats.totalSessions}</h3>
                                </div>
                                <BiHistory size={36} className="opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm bg-success text-white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Tổng doanh thu</div>
                                    <h4 className="fw-bold mb-0">{formatPrice(mockUsageStats.totalRevenue)}</h4>
                                </div>
                                <BiMoney size={36} className="opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm bg-info text-white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Sân phổ biến nhất</div>
                                    <h4 className="fw-bold mb-0">{mockUsageStats.mostPopularCourt}</h4>
                                </div>
                                <BiTrendingUp size={36} className="opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm bg-warning text-white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="small opacity-75">Khung giờ phổ biến</div>
                                    <h5 className="fw-bold mb-0">{mockUsageStats.mostPopularTimeSlot}</h5>
                                </div>
                                <BiBarChart size={36} className="opacity-50" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Stats per court */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 fw-bold">📊 Thống kê theo sân</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {mockUsageStats.byCourtData.map(d => (
                            <Col md={3} key={d.courtId} className="mb-3">
                                <Card className="h-100 border shadow-sm">
                                    <Card.Body className="p-3">
                                        <div className="fw-bold mb-1">{d.courtName}</div>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <div className="small text-muted">Lượt đặt</div>
                                                <div className="fw-bold text-primary">{d.sessions}</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="small text-muted">Doanh thu</div>
                                                <div className="fw-bold text-success small">{formatPrice(d.revenue)}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar bg-primary"
                                                    style={{ width: `${(d.sessions / 32) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="py-2">
                    <div className="d-flex gap-3 align-items-center flex-wrap">
                        <BiFilterAlt className="text-muted" />
                        <Form.Select style={{ width: '150px' }} value={filterCourt} onChange={e => setFilterCourt(e.target.value)}>
                            {courts.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả sân' : c}</option>)}
                        </Form.Select>
                        <Form.Control type="date" style={{ width: '170px' }} value={filterFrom} onChange={e => setFilterFrom(e.target.value)} placeholder="Từ ngày" />
                        <Form.Control type="date" style={{ width: '170px' }} value={filterTo} onChange={e => setFilterTo(e.target.value)} placeholder="Đến ngày" />
                        <Button size="sm" variant="outline-secondary" onClick={() => { setFilterCourt('all'); setFilterFrom(''); setFilterTo(''); }}>
                            Xóa lọc
                        </Button>
                        <span className="ms-auto text-muted small">
                            Kết quả: {totalSessions} lượt | Doanh thu: {formatPrice(totalRevenue)}
                        </span>
                    </div>
                </Card.Body>
            </Card>

            {/* History Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Sân</th>
                                <th>Loại</th>
                                <th>Ngày</th>
                                <th>Khung giờ</th>
                                <th>Thời lượng</th>
                                <th>Khách hàng</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(h => (
                                <tr key={h.id}>
                                    <td className="align-middle text-muted">{h.id}</td>
                                    <td className="align-middle fw-bold">{h.courtName}</td>
                                    <td className="align-middle">
                                        <Badge bg={getTypeColor(h.type)} text={h.type === 'VIP' ? 'dark' : 'white'}>
                                            {h.type}
                                        </Badge>
                                    </td>
                                    <td className="align-middle">{formatDate(h.date)}</td>
                                    <td className="align-middle">{h.timeSlot}</td>
                                    <td className="align-middle">{h.duration}h</td>
                                    <td className="align-middle">{h.customer}</td>
                                    <td className="align-middle fw-bold text-success">{formatPrice(h.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan={7} className="text-end fw-bold">Tổng:</td>
                                <td className="fw-bold text-success">{formatPrice(totalRevenue)}</td>
                            </tr>
                        </tfoot>
                    </Table>
                    {filtered.length === 0 && (
                        <div className="text-center py-5 text-muted">Không có dữ liệu phù hợp bộ lọc</div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourtUsageHistory;
