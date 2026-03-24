import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { BiUser, BiDollar, BiCalendar, BiTrendingUp } from 'react-icons/bi';
import adminStatsService from '../../services/adminStatsService';

const Statistics = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 });
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [statsRes, trendsRes] = await Promise.all([
                    adminStatsService.getOccupancyRate(), // Assuming this gives base stats too or just occupancy
                    adminStatsService.getTrends()
                ]);
                // Fallback to empty if not matching
                setStats(statsRes.data?.stats || { totalUsers: 0, activeUsers: 0 });
                setTrends(trendsRes.data?.trends || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    const totalYearRevenue = (trends || []).reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalYearBookings = (trends || []).reduce((sum, item) => sum + (item.bookings || 0), 0);

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Thống kê hệ thống</h2>

            <Row className="mb-4">
                <Col md={3} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="text-center">
                                <BiUser size={40} className="text-primary mb-2" />
                                <h2 className="fw-bold mb-1">{stats.totalUsers}</h2>
                                <p className="text-muted mb-0">Tổng người dùng</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="text-center">
                                <BiCalendar size={40} className="text-success mb-2" />
                                <h2 className="fw-bold mb-1">{totalYearBookings}</h2>
                                <p className="text-muted mb-0">Đặt sân trong năm</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="text-center">
                                <BiDollar size={40} className="text-warning mb-2" />
                                <h3 className="fw-bold mb-1">{formatPrice(totalYearRevenue)}</h3>
                                <p className="text-muted mb-0">Doanh thu năm</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="text-center">
                                <BiTrendingUp size={40} className="text-info mb-2" />
                                <h2 className="fw-bold mb-1">{stats.activeUsers}</h2>
                                <p className="text-muted mb-0">Người dùng hoạt động</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h4 className="fw-bold mb-4">Thống kê theo tháng</h4>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Tháng</th>
                                    <th>Số đặt sân</th>
                                    <th>Doanh thu</th>
                                    <th>TB/đặt sân</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trends.map(item => (
                                    <tr key={item.month}>
                                        <td>{item.month}/{new Date().getFullYear()}</td>
                                        <td className="fw-bold">{item.bookings}</td>
                                        <td className="text-success fw-bold">{formatPrice(item.revenue)}</td>
                                        <td>{formatPrice(item.bookings > 0 ? item.revenue / item.bookings : 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Statistics;
