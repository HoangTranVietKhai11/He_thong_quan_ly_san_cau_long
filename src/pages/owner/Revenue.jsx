import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { BiDollar, BiTrendingUp, BiCalendar } from 'react-icons/bi';
import ownerService from '../../services/ownerService';

const Revenue = () => {
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
                setError('Không thể tải dữ liệu doanh thu: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    const overview = stats?.overview || {};
    const facilities = stats?.revenue_by_facility || [];

    const totalRevenue = overview.total_revenue || 0;
    const totalBookings = facilities.reduce((sum, item) => sum + parseInt(item.total_bookings), 0) || 0;
    const avgRevenue = facilities.length > 0 ? totalRevenue / facilities.length : 0;


    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Doanh thu</h2>

            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng doanh thu toàn bộ cơ sở</p>
                                    <h3 className="fw-bold mb-0">{formatPrice(totalRevenue)}</h3>
                                </div>
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiDollar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Doanh thu trung bình / Cơ sở</p>
                                    <h3 className="fw-bold mb-0">{formatPrice(avgRevenue)}</h3>
                                </div>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiTrendingUp size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng đặt sân</p>
                                    <h3 className="fw-bold mb-0">{totalBookings}</h3>
                                </div>
                                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px' }}>
                                    <BiCalendar size={30} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h4 className="fw-bold mb-4">Chi tiết Doanh thu theo Cơ sở</h4>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Kỳ báo cáo</th>
                                    <th>Cơ sở (Facility)</th>
                                    <th>Số đặt sân</th>
                                    <th>Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facilities.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>Tháng hiện tại</td>
                                            <td className="fw-bold">{item.name}</td>
                                            <td>{item.total_bookings} lượt</td>
                                            <td className="fw-bold text-success">{formatPrice(item.total_revenue)}</td>
                                        </tr>
                                    );
                                })}
                                {facilities.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">Chưa có dữ liệu thống kê doanh thu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Revenue;
