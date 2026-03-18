import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { BiCalendar, BiDollar, BiTrendingUp, BiBuilding } from 'react-icons/bi';
import ownerService from '../../services/ownerService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await ownerService.getDashboardStats();
                setStats(res.data);
            } catch (err) {
                setError('Không thể tải dữ liệu Chủ sân: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><Spinner animation="border" variant="primary" /></div>;

    const overview = stats?.overview || {};
    const facilities = stats?.revenue_by_facility || [];

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Dashboard - Chủ sân (Toàn Lưỡi)</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng Cơ sở</p>
                                    <h2 className="fw-bold mb-0">{overview.total_facilities || 0}</h2>
                                </div>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiBuilding size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng Đặt sân (Pending)</p>
                                    <h2 className="fw-bold mb-0">{overview.pending_bookings || 0}</h2>
                                </div>
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiCalendar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng Doanh thu Hệ thống</p>
                                    <h4 className="fw-bold mb-0">{formatPrice(overview.total_revenue)}</h4>
                                </div>
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiDollar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3} md={6} className="mb-4">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng số Người dùng</p>
                                    <h2 className="fw-bold mb-0">{overview.total_users || 0}</h2>
                                </div>
                                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiTrendingUp size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Doanh thu theo từng Cơ sở (Facility)</h4>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên Cơ sở</th>
                                            <th>Tổng Lượt đặt sân</th>
                                            <th>Tổng Doanh thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilities.map(f => (
                                            <tr key={f.id}>
                                                <td>#{f.id}</td>
                                                <td><span className="fw-bold">{f.name}</span></td>
                                                <td>{f.total_bookings || 0} lượt</td>
                                                <td className="text-success fw-bold">{formatPrice(f.total_revenue)}</td>
                                            </tr>
                                        ))}
                                        {facilities.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-4">Chưa có dữ liệu cơ sở</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
