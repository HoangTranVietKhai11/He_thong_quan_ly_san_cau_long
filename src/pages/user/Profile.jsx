import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { BiUser, BiEnvelope, BiCamera, BiPhone, BiLock } from 'react-icons/bi';
import authService from '../../services/authService';

const Profile = () => {
    const user = authService.getCurrentUser() || {};
    const [formData, setFormData] = useState({
        name: user.username || user.name || 'Người dùng',
        email: user.email || '',
        phone: user.phone || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle update profile
        alert('Cập nhật thông tin thành công!');
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Thông tin cá nhân</h2>

            <Row>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="text-center">
                            <div className="position-relative d-inline-block mb-3">
                                <img 
                                    src={user.avatar || 'https://via.placeholder.com/150'}
                                    alt={user.username || 'User'}
                                    className="rounded-circle"
                                    width="150"
                                    height="150"
                                />
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="position-absolute bottom-0 end-0 rounded-circle"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <BiCamera />
                                </Button>
                            </div>
                            <h4 className="fw-bold mb-1">{user.username || 'Người dùng'}</h4>
                            <p className="text-muted mb-3">{user.email}</p>
                            <div className="d-flex justify-content-around text-center">
                                <div>
                                    <h5 className="fw-bold mb-0">{user.totalBookings || 0}</h5>
                                    <small className="text-muted">Đặt sân</small>
                                </div>
                                <div className="border-start border-end px-3">
                                    <h5 className="fw-bold mb-0">{user.status === 'active' ? 'Đang hoạt động' : 'Đang hoạt động'}</h5>
                                    <small className="text-muted">Trạng thái</small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Thông tin tài khoản</h5>
                            <div className="mb-2">
                                <small className="text-muted">Ngày tham gia</small>
                                <p className="mb-0">{new Date(user.created_at || user.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div className="mb-2">
                                <small className="text-muted">Loại tài khoản</small>
                                <p className="mb-0 text-capitalize">{user.role}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Chỉnh sửa thông tin</h4>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <BiUser className="me-2" />
                                                Họ và tên
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <BiEnvelope className="me-2" />
                                                Email
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled
                                            />
                                            <Form.Text className="text-muted">
                                                Email không thể thay đổi
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        <BiPhone className="me-2" />
                                        Số điện thoại
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary">
                                    Lưu thay đổi
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Đổi mật khẩu</h4>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <BiLock className="me-2" />
                                        Mật khẩu hiện tại
                                    </Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <BiLock className="me-2" />
                                                Mật khẩu mới
                                            </Form.Label>
                                            <Form.Control type="password" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                <BiLock className="me-2" />
                                                Xác nhận mật khẩu mới
                                            </Form.Label>
                                            <Form.Control type="password" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="warning" className="text-white">
                                    Đổi mật khẩu
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
