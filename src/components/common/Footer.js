import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiEnvelope, BiPhone, BiMap } from 'react-icons/bi';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-5 mt-5">
            <Container>
                <Row>
                    <Col md={4} className="mb-4 mb-md-0">
                        <h5 className="mb-3">🏸 BadmintonBook</h5>
                        <p className="text-muted">
                            Hệ thống đặt sân cầu lông hàng đầu Việt Nam.
                            Đặt sân dễ dàng, nhanh chóng và tiện lợi.
                        </p>
                    </Col>

                    <Col md={4} className="mb-4 mb-md-0">
                        <h6 className="mb-3">Liên kết</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/about" className="text-decoration-none text-muted">Giới thiệu</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/register" className="text-decoration-none text-muted">Đăng ký</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/login" className="text-decoration-none text-muted">Đăng nhập</Link>
                            </li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h6 className="mb-3">Liên hệ</h6>
                        <ul className="list-unstyled text-muted">
                            <li className="mb-2">
                                <BiMap className="me-2" />
                                123 Đường Láng, Đống Đa, Hà Nội
                            </li>
                            <li className="mb-2">
                                <BiPhone className="me-2" />
                                1900 1234
                            </li>
                            <li className="mb-2">
                                <BiEnvelope className="me-2" />
                                support@badmintonbook.vn
                            </li>
                        </ul>
                    </Col>
                </Row>

                <hr className="my-4 border-secondary" />

                <Row>
                    <Col className="text-center text-muted">
                        <small>© 2027 BadmintonBook. Tất cả quyền được bảo lưu.</small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
