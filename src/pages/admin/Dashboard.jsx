import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { BiUser, BiBuilding, BiCalendar, BiDollar, BiTrendingUp } from 'react-icons/bi';
import adminService from '../../services/adminService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fmt = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminService.getDashboardStats();
                setStats(res.data);
            } catch (e) {
                setError('Không thể tải dữ liệu: ' + (e.response?.data?.message || e.message));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" variant="primary" /></div>;

    const overview = stats || {};
    const topCourts = stats?.top_courts || [];
    const revenueByDay = stats?.revenue_by_day?.slice(0, 7) || [];
    const byStatus = stats?.bookings_by_status || [];

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Dashboard - Quản trị viên</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                {[
                    { label: 'Tổng người dùng', value: overview.total_users, icon: <BiUser size={30} />, color: 'bg-primary' },
                    { label: 'Tổng sân', value: overview.total_courts, icon: <BiBuilding size={30} />, color: 'bg-success' },
                    { label: 'Tổng đặt sân', value: overview.total_bookings, icon: <BiCalendar size={30} />, color: 'bg-warning' },
                    { label: 'Tổng doanh thu', value: fmt(overview.total_revenue), icon: <BiDollar size={30} />, color: 'bg-info' },
                ].map((item, i) => (
                    <Col lg={3} md={6} className="mb-4" key={i}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1">{item.label}</p>
                                        <h3 className="fw-bold mb-0">{item.value ?? 0}</h3>
                                    </div>
                                    <div className={`${item.color} text-white rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                                        {item.icon}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col lg={7}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white"><h5 className="mb-0">Top Sân Được Đặt Nhiều Nhất</h5></Card.Header>
                        <Card.Body>
                            {topCourts.length > 0 ? (
                                <Table hover>
                                    <thead><tr><th>#</th><th>Tên sân</th><th>Số lượt đặt</th><th>Doanh thu</th></tr></thead>
                                    <tbody>
                                        {topCourts.map((court, i) => (
                                            <tr key={court.id}>
                                                <td><Badge bg="primary">{i + 1}</Badge></td>
                                                <td><strong>{court.name}</strong></td>
                                                <td>{court.bookings} lượt</td>
                                                <td>{fmt(court.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : <p className="text-muted">Chưa có dữ liệu.</p>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white"><h5 className="mb-0">Trạng thái đặt sân</h5></Card.Header>
                        <Card.Body>
                            {byStatus.map(s => (
                                <div key={s.status} className="d-flex justify-content-between align-items-center mb-2">
                                    <span><Badge bg="secondary">{s.status}</Badge></span>
                                    <strong>{s.count} đơn</strong>
                                </div>
                            ))}
                            {byStatus.length === 0 && <p className="text-muted">Chưa có dữ liệu.</p>}
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm bg-success text-white">
                        <Card.Body>
                            <h6 className="fw-bold mb-2"><BiTrendingUp className="me-2" />Đang hoạt động</h6>
                            <p className="small mb-0">Có <strong>{overview.active_bookings || 0}</strong> booking đang diễn ra tại cơ sở.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
