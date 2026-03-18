import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import { BiBarChart, BiTrendingUp, BiCalendar, BiTime, BiWallet } from 'react-icons/bi';
import adminStatsService from '../../../services/adminStatsService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const hourlyData = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(h => ({
    hour: `${h}:00`, bookings: Math.floor(Math.random() * 30) + (h >= 17 && h <= 20 ? 25 : 5),
}));
const maxHourly = Math.max(...hourlyData.map(d => d.bookings));

const weeklyData = [
    { day: 'Thứ 2', bookings: 45, revenue: 12600000 },
    { day: 'Thứ 3', bookings: 38, revenue: 10560000 },
    { day: 'Thứ 4', bookings: 52, revenue: 14400000 },
    { day: 'Thứ 5', bookings: 41, revenue: 11400000 },
    { day: 'Thứ 6', bookings: 67, revenue: 18600000 },
    { day: 'Thứ 7', bookings: 89, revenue: 24600000 },
    { day: 'CN', bookings: 78, revenue: 21600000 },
];
const maxWeekly = Math.max(...weeklyData.map(d => d.bookings));

const topCustomers = [
    { name: 'Nguyễn Văn A', bookings: 34, spent: 9520000, badge: '🥇' },
    { name: 'Trần Thị B', bookings: 28, spent: 7840000, badge: '🥈' },
    { name: 'Lê Văn C', bookings: 25, spent: 7000000, badge: '🥉' },
    { name: 'Phạm Minh D', bookings: 22, spent: 6160000, badge: '' },
    { name: 'Đỗ Thị E', bookings: 19, spent: 5320000, badge: '' },
];

const BookingAnalytics = () => {
    const [activeTab, setActiveTab] = useState('hourly');
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                const res = await adminStatsService.getTrends();
                setTrends(res.data?.data || res.data);
            } catch (err) {
                setError('Lỗi tải dữ liệu phân tích: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    // Calculate real stats from API
    const bookingStats = trends?.booking_status_breakdown || [];
    const paymentStats = trends?.payment_methods || [];
    
    const totalBookings = bookingStats.reduce((sum, s) => sum + parseInt(s.count), 0);
    const cancelledBookings = bookingStats.find(s => s.status === 'Cancelled')?.count || 0;
    const cancelRate = totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(1) : 0;
    
    // Total revenue from all methods combined
    const totalRevenue = paymentStats.reduce((sum, p) => sum + parseFloat(p.total), 0);
    const maxRevenuePoint = Math.max(...paymentStats.map(p => parseFloat(p.total)), 1);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiBarChart className="me-2 text-primary" />Phân tích đặt sân</h2>
                    <p className="text-muted mb-0">Xu hướng đặt sân theo giờ, ngày trong tuần và khách hàng thân thiết</p>
                </div>
                <Form.Select style={{ width: 160 }}>
                    <option>Tháng này</option><option>Tháng trước</option><option>3 tháng</option>
                </Form.Select>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng Lượt Đặt', value: totalBookings, sub: 'Trong hệ thống', color: 'primary' },
                    { label: 'Tỷ lệ hủy', value: `${cancelRate}%`, sub: `${cancelledBookings} lượt hủy`, color: cancelRate > 20 ? 'danger' : 'success' },
                    { label: 'Tổng Doanh thu', value: fmt(totalRevenue), sub: 'Chỉ tính giao dịch Success', color: 'warning' },
                    { label: 'Phương thức nạp nhiều nhất', value: paymentStats.sort((a,b) => b.total - a.total)[0]?.payment_method || 'N/A', sub: 'Thống kê giao dịch', color: 'info' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold`}>{s.label}</div>
                                <h3 className="fw-bold mb-0">{s.value}</h3>
                                <small className="text-muted">{s.sub}</small>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white">
                    <Nav variant="tabs">
                        {[
                            ['hourly', <><BiTime className="me-1" />Khung giờ mẫu</>], 
                            ['weekly', <><BiCalendar className="me-1" />Ngày mẫu</>],
                            ['payments', <><BiWallet className="me-1" />Phương thức GD</>]
                        ].map(([k, l]) => (
                            <Nav.Item key={k}><Nav.Link active={activeTab === k} onClick={() => setActiveTab(k)}>{l}</Nav.Link></Nav.Item>
                        ))}
                    </Nav>
                </Card.Header>
                <Card.Body>
                    {activeTab === 'hourly' && (
                        <>
                            <p className="text-muted small mb-3">Số lượt đặt trung bình theo từng khung giờ trong ngày</p>
                            <div className="d-flex align-items-end gap-1" style={{ height: 180 }}>
                                {hourlyData.map((d, i) => (
                                    <div key={i} className="flex-grow-1 text-center" style={{ minWidth: 30 }}>
                                        <div style={{ height: `${(d.bookings / maxHourly) * 150}px`, background: d.hour >= '17:00' && d.hour <= '20:00' ? 'linear-gradient(to top, #ffc107, #ffda6a)' : 'linear-gradient(to top, #0d6efd, #6ea8fe)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`${d.hour}: ${d.bookings} lượt`} />
                                        <div style={{ fontSize: '0.6rem', color: '#666', marginTop: 2 }}>{d.hour.replace(':00', '')}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex gap-3 mt-2 small">
                                <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#ffc107', borderRadius: 2 }} /> Giờ vàng (peak)</span>
                                <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#0d6efd', borderRadius: 2 }} /> Giờ thường</span>
                            </div>
                        </>
                    )}
                    {activeTab === 'weekly' && (
                        <div className="d-flex align-items-end gap-3" style={{ height: 180 }}>
                            {weeklyData.map((d, i) => (
                                <div key={i} className="flex-grow-1 text-center">
                                    <small className="text-success d-block mb-1">{d.bookings}</small>
                                    <div style={{ height: `${(d.bookings / maxWeekly) * 150}px`, background: 'linear-gradient(to top, #198754, #75b798)', borderRadius: '6px 6px 0 0' }} title={`${d.day}: ${d.bookings} lượt`} />
                                    <small className="text-muted">{d.day}</small>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <>
                            <p className="text-muted small mb-3">Phân bổ doanh thu theo phương thức thanh toán (Dữ liệu thực tế)</p>
                            <div className="d-flex align-items-end gap-4 justify-content-center" style={{ height: 180 }}>
                                {paymentStats.map((p, i) => {
                                    const total = parseFloat(p.total);
                                    const heightPct = (total / maxRevenuePoint) * 150;
                                    const colors = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d'];
                                    return (
                                        <div key={i} className="text-center" style={{ minWidth: 80 }}>
                                            <small className="text-dark d-block mb-1 fw-bold">{fmt(total)}</small>
                                            <div style={{ height: `${heightPct}px`, background: colors[i % colors.length], borderRadius: '6px 6px 0 0', width: '100%' }} title={`${p.payment_method}: ${fmt(total)}`} />
                                            <small className="text-muted mt-2 d-block fw-bold">{p.payment_method}</small>
                                        </div>
                                    )
                                })}
                                {paymentStats.length === 0 && (
                                    <p className="text-muted text-center w-100">Chưa có dữ liệu thanh toán.</p>
                                )}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white fw-bold"><BiTrendingUp className="me-2 text-warning" />Top khách hàng thân thiết</Card.Header>
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead className="bg-light"><tr><th>#</th><th>Khách hàng</th><th>Lượt đặt</th><th>Tổng chi</th><th>Hạng</th></tr></thead>
                        <tbody>
                            {topCustomers.map((c, i) => (
                                <tr key={i}>
                                    <td className="align-middle">{c.badge || (i + 1)}</td>
                                    <td className="align-middle fw-bold">{c.name}</td>
                                    <td className="align-middle"><Badge bg="primary">{c.bookings} lượt</Badge></td>
                                    <td className="align-middle text-success fw-bold">{fmt(c.spent)}</td>
                                    <td className="align-middle"><Badge bg={i < 1 ? 'warning' : i < 3 ? 'secondary' : 'light'} text={i >= 3 ? 'dark' : undefined}>{i < 1 ? 'VIP Gold' : i < 3 ? 'VIP Silver' : 'Regular'}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingAnalytics;
