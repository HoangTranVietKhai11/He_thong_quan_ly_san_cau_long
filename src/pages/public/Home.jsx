import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiStar, BiMapPin, BiTime, BiMoney, BiPhone, BiEnvelope } from 'react-icons/bi';
import { FiCheckCircle } from 'react-icons/fi';
import courtService from '../../services/courtService';
import FACILITY_INFO from '../../config/facility';

const Home = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await courtService.getCourts();
                setCourts(Array.isArray(res.data) ? res.data : res.data?.courts || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const availableCourts = courts.filter(c => c.status === 'available' || !c.is_maintenance).length;
    const vipCourts = courts.filter(c => c.type === 'VIP').length;

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h1 className="display-4 fw-bold mb-4">
                                {FACILITY_INFO.name}
                            </h1>
                            <p className="lead mb-4">
                                {FACILITY_INFO.description}
                            </p>
                            <div className="d-flex gap-3 mb-4">
                                <Button as={Link} to="/courts" variant="light" size="lg">
                                    Xem sân & Đặt ngay
                                </Button>
                                <Button as={Link} to="/about" variant="outline-light" size="lg">
                                    Giới thiệu
                                </Button>
                            </div>
                            {/* Contact Info */}
                            <div className="text-white-50">
                                <div className="mb-2">
                                    <BiMapPin className="me-2" />
                                    {FACILITY_INFO.address}
                                </div>
                                <div className="mb-2">
                                    <BiPhone className="me-2" />
                                    {FACILITY_INFO.phone}
                                </div>
                                <div>
                                    <BiTime className="me-2" />
                                    {FACILITY_INFO.openTime} - {FACILITY_INFO.closeTime}
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} className="d-none d-lg-block text-center">
                            <img
                                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600"
                                alt="Badminton Court"
                                className="img-fluid rounded shadow-lg"
                                style={{ maxHeight: '400px' }}
                            />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-4 bg-light border-bottom">
                <Container>
                    <Row className="text-center">
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">{loading ? '...' : courts.length}</h2>
                            <p className="text-muted mb-0">Sân cầu lông</p>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">{loading ? '...' : availableCourts}</h2>
                            <p className="text-muted mb-0">Sân sẵn sàng</p>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">{loading ? '...' : vipCourts}</h2>
                            <p className="text-muted mb-0">Sân VIP</p>
                        </Col>
                        <Col md={3}>
                            <h2 className="text-primary fw-bold mb-0">4.9★</h2>
                            <p className="text-muted mb-0">Đánh giá</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Courts Preview */}
            <section className="py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">Các Sân Cầu Lông Của Chúng Tôi</h2>
                        <p className="text-muted">{loading ? 'Đang tải...' : `${courts.length} sân chất lượng cao với giá cả hợp lý`}</p>
                    </div>

                    <Row>
                        {/* VIP Courts */}
                        <Col md={6} className="mb-4">
                            <Card className="h-100 border-warning shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <Badge bg="warning" text="dark" className="mb-2">VIP</Badge>
                                            <h4 className="mb-0">Sân VIP</h4>
                                        </div>
                                        <div className="text-end">
                                            <div className="h5 text-primary mb-0">
                                                {formatPrice(100000)}
                                            </div>
                                            <small className="text-muted">/giờ</small>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-3">
                                        Sân VIP với trang thiết bị cao cấp nhất
                                    </p>
                                    <ul className="list-unstyled mb-3">
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Ánh sáng LED chuyên dụng
                                        </li>
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Mặt sân chuyên nghiệp quốc tế
                                        </li>
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Điều hòa không khí
                                        </li>
                                    </ul>
                                    <div className="text-muted small">
                                        {vipCourts} sân VIP (Court 1, 2)
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Standard Courts */}
                        <Col md={6} className="mb-4">
                            <Card className="h-100 border-info shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <Badge bg="info" className="mb-2">TIÊU CHUẨN</Badge>
                                            <h4 className="mb-0">Sân Tiêu Chuẩn</h4>
                                        </div>
                                        <div className="text-end">
                                            <div className="h5 text-primary mb-0">
                                                {formatPrice(80000)}
                                            </div>
                                            <small className="text-muted">/giờ</small>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-3">
                                        Sân tiêu chuẩn chất lượng tốt, giá hợp lý
                                    </p>
                                    <ul className="list-unstyled mb-3">
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Ánh sáng đầy đủ
                                        </li>
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Mặt sân chuẩn tốt
                                        </li>
                                        <li className="mb-2">
                                            <FiCheckCircle className="text-success me-2" />
                                            Phù hợp luyện tập
                                        </li>
                                    </ul>
                                    <div className="text-muted small">
                                        {courts.filter(c => c.type === 'STANDARD').length} sân tiêu chuẩn (Court 3-8)
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="text-center mt-4">
                        <Button as={Link} to="/courts" variant="primary" size="lg">
                            Xem Tất Cả Sân & Đặt Ngay
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center fw-bold mb-5">Tiện Ích & Dịch Vụ</h2>
                    <Row>
                        {FACILITY_INFO.features.map((feature, index) => (
                            <Col key={index} md={4} className="mb-4">
                                <div className="d-flex align-items-start">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                                        <FiCheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h5 className="mb-2">{feature}</h5>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-primary text-white">
                <Container className="text-center">
                    <h2 className="fw-bold mb-3">Sẵn Sàng Đặt Sân?</h2>
                    <p className="lead mb-4">
                        Đăng ký ngay để trải nghiệm dịch vụ đặt sân tuyệt vời tại {FACILITY_INFO.shortName}
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button as={Link} to="/register" variant="light" size="lg">
                            Đăng Ký Miễn Phí
                        </Button>
                        <Button as={Link} to="/courts" variant="outline-light" size="lg">
                            Xem Giá Sân
                        </Button>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Home;
