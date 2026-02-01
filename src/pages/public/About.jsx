import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BiBullseye, BiHeart, BiTrophy } from 'react-icons/bi';

const About = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-center mb-5">
                <Col lg={8} className="text-center">
                    <h1 className="display-4 fw-bold mb-4">Giới Thiệu</h1>
                    <p className="lead text-muted">
                        Hệ thống đặt sân cầu lông hàng đầu Việt Nam,
                        mang đến trải nghiệm tuyệt vời cho người chơi và chủ sân
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col lg={6} className="mb-4">
                    <img
                        src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
                        alt="About Us"
                        className="img-fluid rounded shadow-lg"
                    />
                </Col>
                <Col lg={6} className="d-flex align-items-center">
                    <div>
                        <h2 className="fw-bold mb-4">Câu Chuyện Của Chúng Tôi</h2>
                        <p className="text-muted mb-3">
                            Được thành lập vào năm 2025, chúng tôi khởi đầu với mục tiêu đơn giản:
                            làm cho việc đặt sân cầu lông trở nên dễ dàng và thuận tiện hơn bao giờ hết.
                        </p>
                        <p className="text-muted mb-3">
                            Với đội ngũ đam mê cầu lông, chúng tôi hiểu rõ những khó khăn khi tìm kiếm
                            và đặt sân. Vì vậy, chúng tôi đã xây dựng một nền tảng kết nối người chơi
                            với các sân cầu lông chất lượng cao trên khắp cả nước.
                        </p>
                        <p className="text-muted">
                            Hôm nay, chúng tôi tự hào phục vụ hơn 1,200 người dùng và hợp tác với
                            hàng chục chủ sân uy tín.
                        </p>
                    </div>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '80px', height: '80px' }}>
                            <BiBullseye size={40} />
                        </div>
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Sứ Mệnh</h4>
                            <p className="text-muted">
                                Tạo ra một nền tảng đặt sân cầu lông tiện lợi,
                                giúp mọi người dễ dàng tiếp cận và tận hưởng môn thể thao này.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '80px', height: '80px' }}>
                            <BiHeart size={40} />
                        </div>
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Giá Trị</h4>
                            <p className="text-muted">
                                Đặt khách hàng làm trung tâm, minh bạch trong mọi giao dịch,
                                và cam kết cung cấp dịch vụ chất lượng cao nhất.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '80px', height: '80px' }}>
                            <BiTrophy size={40} />
                        </div>
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Tầm Nhìn</h4>
                            <p className="text-muted">
                                Trở thành nền tảng đặt sân cầu lông số 1 Việt Nam,
                                kết nối hàng triệu người chơi và hàng nghìn sân.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="bg-light rounded p-5">
                <Col className="text-center">
                    <h2 className="fw-bold mb-4">Thành Tựu Của Chúng Tôi</h2>
                    <Row>
                        <Col md={3} className="mb-3">
                            <h1 className="text-primary fw-bold">1,234+</h1>
                            <p className="text-muted">Người dùng</p>
                        </Col>
                        <Col md={3} className="mb-3">
                            <h1 className="text-primary fw-bold">45+</h1>
                            <p className="text-muted">Sân hợp tác</p>
                        </Col>
                        <Col md={3} className="mb-3">
                            <h1 className="text-primary fw-bold">5,678+</h1>
                            <p className="text-muted">Đặt sân thành công</p>
                        </Col>
                        <Col md={3} className="mb-3">
                            <h1 className="text-primary fw-bold">4.8★</h1>
                            <p className="text-muted">Đánh giá trung bình</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
