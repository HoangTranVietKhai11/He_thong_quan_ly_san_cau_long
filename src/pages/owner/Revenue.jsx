import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BiDollar, BiTrendingUp, BiCalendar } from 'react-icons/bi';
import { mockRevenueData } from '../../utils/mockData';

const Revenue = () => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = mockRevenueData.reduce((sum, item) => sum + item.bookings, 0);
    const avgRevenue = totalRevenue / mockRevenueData.length;

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Doanh thu</h2>

            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1">Tổng doanh thu năm</p>
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
                                    <p className="text-muted mb-1">TB/tháng</p>
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
                    <h4 className="fw-bold mb-4">Doanh thu theo tháng</h4>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Tháng</th>
                                    <th>Số đặt sân</th>
                                    <th>Doanh thu</th>
                                    <th>Tăng trưởng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockRevenueData.map((item, index) => {
                                    const prevRevenue = index > 0 ? mockRevenueData[index - 1].revenue : item.revenue;
                                    const growth = ((item.revenue - prevRevenue) / prevRevenue * 100).toFixed(1);
                                    return (
                                        <tr key={item.month}>
                                            <td>{item.month}/2025</td>
                                            <td>{item.bookings}</td>
                                            <td className="fw-bold">{formatPrice(item.revenue)}</td>
                                            <td>
                                                <span className={`badge bg-${growth >= 0 ? 'success' : 'danger'}`}>
                                                    {growth >= 0 ? '+' : ''}{growth}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Revenue;
