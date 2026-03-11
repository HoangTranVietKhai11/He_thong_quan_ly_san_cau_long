import React, { useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { BiDollar, BiTrendingUp, BiCalendar } from 'react-icons/bi';
import { mockRevenue } from '../../../utils/mockAdminData';

const Revenue = () => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const summary = mockRevenue.summary;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Báo cáo doanh thu</h2>
                <p className="text-muted">Theo dõi và phân tích doanh thu</p>
            </div>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiDollar size={40} className="text-primary me-3" />
                                <div>
                                    <div className="text-muted small">Hôm nay</div>
                                    <h4 className="fw-bold mb-0 text-primary">{formatPrice(summary.today)}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiCalendar size={40} className="text-info me-3" />
                                <div>
                                    <div className="text-muted small">Tuần này</div>
                                    <h4 className="fw-bold mb-0 text-info">{formatPrice(summary.thisWeek)}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiTrendingUp size={40} className="text-success me-3" />
                                <div>
                                    <div className="text-muted small">Tháng này</div>
                                    <h4 className="fw-bold mb-0 text-success">{formatPrice(summary.thisMonth)}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiDollar size={40} className="text-warning me-3" />
                                <div>
                                    <div className="text-muted small">Tháng trước</div>
                                    <h4 className="fw-bold mb-0 text-warning">{formatPrice(summary.lastMonth)}</h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Growth Comparison */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 fw-bold">So sánh tăng trưởng</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <div className="p-3 border rounded">
                                <div className="text-muted small mb-2">Tháng này vs Tháng trước</div>
                                {summary.thisMonth > summary.lastMonth ? (
                                    <div className="text-success">
                                        <h4 className="fw-bold mb-0">
                                            +{formatPrice(summary.thisMonth - summary.lastMonth)}
                                        </h4>
                                        <div className="small">
                                            Tăng {Math.round(((summary.thisMonth - summary.lastMonth) / summary.lastMonth) * 100)}%
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-danger">
                                        <h4 className="fw-bold mb-0">
                                            {formatPrice(summary.thisMonth - summary.lastMonth)}
                                        </h4>
                                        <div className="small">
                                            Giảm {Math.round(((summary.lastMonth - summary.thisMonth) / summary.lastMonth) * 100)}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="p-3 border rounded">
                                <div className="text-muted small mb-2">Dự báo tháng này (theo tuần)</div>
                                <div className="text-info">
                                    <h4 className="fw-bold mb-0">
                                        {formatPrice(summary.thisWeek * 4)}
                                    </h4>
                                    <div className="small">Dự kiến cuối tháng</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Daily Revenue */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 fw-bold">Doanh thu theo ngày (3 ngày gần nhất)</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {mockRevenue.daily.map((day, index) => (
                            <Col md={4} key={index}>
                                <Card className="border mb-3">
                                    <Card.Body>
                                        <div className="text-muted small mb-1">
                                            {new Date(day.date).toLocaleDateString('vi-VN')}
                                        </div>
                                        <h4 className="fw-bold mb-2 text-primary">{formatPrice(day.revenue)}</h4>
                                        <div className="text-muted small">
                                            {day.bookings} bookings
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Revenue;
