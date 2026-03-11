import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiMoney, BiInfoCircle } from 'react-icons/bi';
import { FiCheckCircle } from 'react-icons/fi';
import { mockCourts } from '../../utils/mockData';
import FACILITY_INFO from '../../config/facility';

const Courts = () => {
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('courtNumber');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'in_use': return 'primary';
            case 'maintenance': return 'warning';
            case 'closed': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available': return 'Sẵn sàng';
            case 'in_use': return 'Đang sử dụng';
            case 'maintenance': return 'Bảo trì';
            case 'closed': return 'Đóng cửa';
            default: return status;
        }
    };

    // Filter courts
    let filteredCourts = mockCourts;
    if (filterType !== 'ALL') {
        filteredCourts = filteredCourts.filter(c => c.type === filterType);
    }

    // Sort courts
    filteredCourts = [...filteredCourts].sort((a, b) => {
        if (sortBy === 'courtNumber') return a.courtNumber - b.courtNumber;
        if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'type') return a.type.localeCompare(b.type);
        return 0;
    });

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <div className="mb-4">
                <h1 className="fw-bold mb-2">{FACILITY_INFO.name}</h1>
                <p className="text-muted mb-0">{FACILITY_INFO.address}</p>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="small text-muted mb-1">Loại sân</Form.Label>
                                <Form.Select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="ALL">Tất cả ({mockCourts.length} sân)</option>
                                    <option value="VIP">Sân VIP ({mockCourts.filter(c => c.type === 'VIP').length})</option>
                                    <option value="STANDARD">Sân tiêu chuẩn ({mockCourts.filter(c => c.type === 'STANDARD').length})</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="small text-muted mb-1">Sắp xếp theo</Form.Label>
                                <Form.Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="courtNumber">Số sân</option>
                                    <option value="price">Giá</option>
                                    <option value="type">Loại</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <div className="text-muted small mt-4">
                                Tìm thấy <strong>{filteredCourts.length}</strong> sân
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Courts Grid */}
            <Row>
                {filteredCourts.map(court => (
                    <Col key={court.id} lg={4} md={6} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm hover-shadow">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h4 className="mb-1">{court.courtName}</h4>
                                        <Badge bg={court.type === 'VIP' ? 'warning' : 'info'} text="dark">
                                            {court.type === 'VIP' ? 'VIP' : 'Tiêu chuẩn'}
                                        </Badge>
                                    </div>
                                    <Badge bg={getStatusColor(court.status)}>
                                        {getStatusText(court.status)}
                                    </Badge>
                                </div>

                                <p className="text-muted small mb-3">
                                    {court.description}
                                </p>

                                <div className="mb-3">
                                    <div className="text-primary fw-bold h4 mb-2">
                                        <BiMoney />
                                        {formatPrice(court.pricePerHour)}
                                        <span className="small text-muted fw-normal">/giờ</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted d-block mb-2"><strong>Trang thiết bị:</strong></small>
                                    <div className="d-flex flex-wrap gap-2">
                                        {court.features.map((feature, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="fw-normal">
                                                <FiCheckCircle className="me-1" size={12} />
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="primary"
                                        disabled={court.status !== 'available'}
                                    >
                                        {court.status === 'available' ? 'Đặt sân ngay' : 'Không khả dụng'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        as="a"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert(`Chi tiết sân:\n\nSân: ${court.courtName}\nLoại: ${court.type}\nGiá: ${formatPrice(court.pricePerHour)}/giờ\nTrạng thái: ${getStatusText(court.status)}\n\nBảo trì gần nhất: ${new Date(court.lastMaintenance).toLocaleDateString('vi-VN')}`);
                                        }}
                                    >
                                        <BiInfoCircle className="me-1" />
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {filteredCourts.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-muted">Không tìm thấy sân phù hợp với bộ lọc</p>
                </div>
            )}

            {/* Info Section */}
            <Card className="border-0 bg-light mt-4">
                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-3 mb-md-0">
                            <h5 className="mb-3">Giờ hoạt động</h5>
                            <p className="mb-0">
                                <strong>{FACILITY_INFO.openTime}</strong> - <strong>{FACILITY_INFO.closeTime}</strong>
                            </p>
                            <small className="text-muted">Tất cả các ngày trong tuần</small>
                        </Col>
                        <Col md={6}>
                            <h5 className="mb-3">Liên hệ đặt sân</h5>
                            <p className="mb-1">
                                <strong>Hotline:</strong> {FACILITY_INFO.phone}
                            </p>
                            <p className="mb-0">
                                <strong>Email:</strong> {FACILITY_INFO.email}
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Courts;
