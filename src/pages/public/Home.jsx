import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiSearch, BiStar, BiMapPin, BiTime, BiMoney } from 'react-icons/bi';
import { mockCourts } from '../../utils/mockData';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourts = mockCourts.filter(court =>
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h1 className="display-4 fw-bold mb-4">
                                Đặt Sân Cầu Lông <br />
                                Nhanh Chóng & Tiện Lợi
                            </h1>
                            <p className="lead mb-4">
                                Hệ thống quản lý và đặt sân cầu lông hàng đầu Việt Nam.
                                Tìm kiếm, so sánh và đặt sân chỉ trong vài giây.
                            </p>
                            <div className="d-flex gap-3">
                                <Button as={Link} to="/register" variant="light" size="lg">
                                    Đăng ký ngay
                                </Button>
                                <Button as={Link} to="/about" variant="outline-light" size="lg">
                                    Tìm hiểu thêm
                                </Button>
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

            {/* Search Section */}
            <section className="py-4 bg-light">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Form.Group className="position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm sân cầu lông theo tên hoặc địa chỉ..."
                                    size="lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="ps-5"
                                />
                                <BiSearch
                                    size={24}
                                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-4 border-bottom">
                <Container>
                    <Row className="text-center">
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">{mockCourts.length}+</h2>
                            <p className="text-muted mb-0">Sân cầu lông</p>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">1,234+</h2>
                            <p className="text-muted mb-0">Người dùng</p>
                        </Col>
                        <Col md={3} className="mb-3 mb-md-0">
                            <h2 className="text-primary fw-bold mb-0">5,678+</h2>
                            <p className="text-muted mb-0">Đặt sân</p>
                        </Col>
                        <Col md={3}>
                            <h2 className="text-primary fw-bold mb-0">4.8★</h2>
                            <p className="text-muted mb-0">Đánh giá TB</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Courts List */}
            <section className="py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Sân Cầu Lông Nổi Bật</h2>
                        <p className="text-muted mb-0">Tìm thấy {filteredCourts.length} sân</p>
                    </div>

                    <Row>
                        {filteredCourts.map(court => (
                            <Col key={court.id} lg={4} md={6} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 hover-shadow">
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <Card.Img
                                            variant="top"
                                            src={court.image}
                                            style={{ height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className="mb-0 h5">{court.name}</Card.Title>
                                            <Badge bg="success" className="ms-2">
                                                <BiStar /> {court.rating}
                                            </Badge>
                                        </div>
                                        <div className="text-muted small mb-2">
                                            <BiMapPin className="me-1" />
                                            {court.address}
                                        </div>
                                        <Card.Text className="text-muted small mb-3">
                                            {court.description.substring(0, 80)}...
                                        </Card.Text>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between text-muted small mb-1">
                                                <span>
                                                    <BiTime className="me-1" />
                                                    {court.openTime} - {court.closeTime}
                                                </span>
                                                <span>{court.totalCourts} sân</span>
                                            </div>
                                            <div className="text-primary fw-bold">
                                                <BiMoney className="me-1" />
                                                {formatPrice(court.pricePerHour)}/giờ
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button
                                                as={Link}
                                                to={`/courts/${court.id}`}
                                                variant="outline-primary"
                                                size="sm"
                                                className="flex-grow-1"
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <Button
                                                as={Link}
                                                to="/register"
                                                variant="primary"
                                                size="sm"
                                                className="flex-grow-1"
                                            >
                                                Đặt ngay
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {filteredCourts.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">Không tìm thấy sân nào phù hợp</p>
                        </div>
                    )}
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center fw-bold mb-5">Tại Sao Chọn Chúng Tôi?</h2>
                    <Row>
                        <Col md={4} className="text-center mb-4">
                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '80px', height: '80px' }}>
                                <BiSearch size={40} />
                            </div>
                            <h4>Dễ Dàng Tìm Kiếm</h4>
                            <p className="text-muted">
                                Tìm kiếm và so sánh hàng trăm sân cầu lông trên toàn quốc
                            </p>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '80px', height: '80px' }}>
                                <BiTime size={40} />
                            </div>
                            <h4>Đặt Sân Nhanh Chóng</h4>
                            <p className="text-muted">
                                Đặt sân trong vài giây, xác nhận ngay lập tức
                            </p>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '80px', height: '80px' }}>
                                <BiMoney size={40} />
                            </div>
                            <h4>Giá Cả Hợp Lý</h4>
                            <p className="text-muted">
                                So sánh giá và tìm sân phù hợp với ngân sách của bạn
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-primary text-white">
                <Container className="text-center">
                    <h2 className="fw-bold mb-3">Sẵn Sàng Bắt Đầu?</h2>
                    <p className="lead mb-4">
                        Đăng ký ngay để trải nghiệm dịch vụ đặt sân tuyệt vời
                    </p>
                    <Button as={Link} to="/register" variant="light" size="lg">
                        Đăng Ký Miễn Phí
                    </Button>
                </Container>
            </section>
        </div>
    );
};

export default Home;
