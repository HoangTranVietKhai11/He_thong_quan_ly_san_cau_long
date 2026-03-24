import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiMapPin, BiPhone, BiTime, BiEnvelope, BiHeart, BiBullseye } from 'react-icons/bi';
import { FiCheckCircle } from 'react-icons/fi';
import FACILITY_INFO from '../../config/facility';

const About = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-center mb-5">
                <Col lg={8} className="text-center">
                    <h1 className="display-4 fw-bold mb-4">Về {FACILITY_INFO.shortName}</h1>
                    <p className="lead text-muted">
                        {FACILITY_INFO.description}
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col lg={6} className="mb-4">
                    <img
                        src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
                        alt={FACILITY_INFO.name}
                        className="img-fluid rounded shadow-lg"
                    />
                </Col>
                <Col lg={6} className="d-flex align-items-center">
                    <div>
                        <h2 className="fw-bold mb-4">Chào Mừng Đến Với {FACILITY_INFO.name}</h2>
                        <p className="text-muted mb-3">
                            Được thành lập vào năm {new Date(FACILITY_INFO.established).getFullYear()},
                            {FACILITY_INFO.name} tự h ào là một trong những cơ sở sân cầu lông
                            hàng đầu tại TP.HCM với đầy đủ trang thiết bị hiện đại.
                        </p>
                        <p className="text-muted mb-3">
                            Chúng tôi cung cấp hệ thống sân cầu lông hiện đại, đáp ứng mọi nhu cầu luyện tập và thi đấu.
                        </p>
                        <ul className="text-muted mb-4">
                            <li>Sân VIP với ánh sáng LED chuyên dụng và điều hòa không khí</li>
                            <li>Sân tiêu chuẩn với mặt sân chất lượng cao</li>
                        </ul>
                        <p className="text-muted">
                            Với đội ngũ nhân viên chuyên nghiệp và nhiệt tình, chúng tôi cam kết
                            mang đến trải nghiệm chơi cầu lông tuyệt vời nhất cho bạn.
                        </p>
                    </div>
                </Col>
            </Row>

            { /* Mission & Values */}
            <Row className="mb-5">
                <Col md={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '80px', height: '80px' }}>
                            <BiBullseye size={40} />
                        </div>
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Sứ Mệnh</h4>
                            <p className="text-muted">
                                Cung cấp sân cầu lông chất lượng cao với giá cả hợp lý,
                                tạo môi trường lý tưởng cho người chơi thể thao.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm text-center p-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: '80px', height: '80px' }}>
                            <BiHeart size={40} />
                        </div>
                        <Card.Body>
                            <h4 className="fw-bold mb-3">Giá Trị</h4>
                            <p className="text-muted">
                                Đặt khách hàng làm trung tâm, dịch vụ chuyên nghiệp,
                                và cam kết duy trì chất lượng tốt nhất.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Facilities & Features */}
            <Row className="mb-5">
                <Col>
                    <h2 className="fw-bold mb-4 text-center">Tiện Ích  & Dịch Vụ</h2>
                    <Row>
                        {FACILITY_INFO.features.map((feature, index) => (
                            <Col key={index} md={4} sm={6} className="mb-3">
                                <div className="d-flex align-items-center">
                                    <FiCheckCircle className="text-success me-2" size={20} />
                                    <span>{feature}</span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* Contact Information */}
            <Row className="bg-light rounded p-5">
                <Col className="text-center">
                    <h2 className="fw-bold mb-4">Thông Tin Liên Hệ</h2>
                    <Row>
                        <Col md={6} className="mb-4">
                            <div className="mb-3">
                                <BiMapPin className="text-primary" size={32} />
                                <h5 className="mt-2">Địa chỉ</h5>
                                <p className="text-muted">{FACILITY_INFO.address}</p>
                            </div>
                            <div className="mb-3">
                                <BiTime className="text-primary" size={32} />
                                <h5 className="mt-2">Giờ hoạt động</h5>
                                <p className="text-muted">
                                    {FACILITY_INFO.openTime} - {FACILITY_INFO.closeTime}
                                    <br />
                                    <small>Tất cả các ngày trong tuần</small>
                                </p>
                            </div>
                        </Col>
                        <Col md={6} className="mb-4">
                            <div className="mb-3">
                                <BiPhone className="text-primary" size={32} />
                                <h5 className="mt-2">Hotline</h5>
                                <p className="text-muted">{FACILITY_INFO.phone}</p>
                            </div>
                            <div className="mb-3">
                                <BiEnvelope className="text-primary" size={32} />
                                <h5 className="mt-2">Email</h5>
                                <p className="text-muted">{FACILITY_INFO.email}</p>
                            </div>
                        </Col>
                    </Row>

                    <div className="mt-4">
                        <Button as={Link} to="/courts" variant="primary" size="lg" className="me-2">
                            Xem Sân & Đặt Ngay
                        </Button>
                        <Button href={FACILITY_INFO.mapUrl} target="_blank" variant="outline-primary" size="lg">
                            Xem Bản Đồ
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
