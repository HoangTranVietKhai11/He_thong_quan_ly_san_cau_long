import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiSave } from 'react-icons/fi';

const StaffProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        id: 5,
        name: 'Trần Văn Staff',
        email: 'staff@example.com',
        phone: '0987654321',
        role: 'staff',
        shift: 'morning',
        joinDate: '2025-01-15',
        status: 'active'
    });

    const [formData, setFormData] = useState({ ...profile });

    const handleEdit = () => {
        setEditMode(true);
        setFormData({ ...profile });
    };

    const handleCancel = () => {
        setEditMode(false);
        setFormData({ ...profile });
    };

    const handleSave = () => {
        setProfile({ ...formData });
        setEditMode(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container fluid className="py-4">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FiUser className="me-2" size={24} />
                                    <h5 className="mb-0">Hồ Sơ Cá Nhân</h5>
                                </div>
                                {!editMode ? (
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={handleEdit}
                                    >
                                        <FiEdit2 className="me-1" />
                                        Chỉnh sửa
                                    </Button>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            onClick={handleCancel}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={handleSave}
                                        >
                                            <FiSave className="me-1" />
                                            Lưu
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {/* Profile Header */}
                            <div className="text-center mb-4">
                                <div
                                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: '100px', height: '100px', fontSize: '36px' }}
                                >
                                    {profile.name.charAt(0)}
                                </div>
                                <h4 className="mb-1">{profile.name}</h4>
                                <Badge bg="primary" className="px-3 py-2">
                                    Nhân viên
                                </Badge>
                            </div>

                            <hr className="my-4" />

                            {/* Profile Information */}
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <FiUser className="me-2" />
                                                Họ và tên
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={!editMode ? 'bg-light' : ''}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <FiMail className="me-2" />
                                                Email
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={profile.email}
                                                disabled
                                                className="bg-light"
                                            />
                                            <Form.Text className="text-muted">
                                                Email không thể thay đổi
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <FiPhone className="me-2" />
                                                Số điện thoại
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={!editMode ? 'bg-light' : ''}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Ca làm việc
                                            </Form.Label>
                                            <Form.Select
                                                name="shift"
                                                value={formData.shift}
                                                onChange={handleChange}
                                                disabled={!editMode}
                                                className={!editMode ? 'bg-light' : ''}
                                            >
                                                <option value="morning">Ca sáng (6h - 14h)</option>
                                                <option value="afternoon">Ca chiều (14h - 22h)</option>
                                                <option value="full">Ca full (6h - 22h)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                <FiCalendar className="me-2" />
                                                Ngày vào làm
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={new Date(profile.joinDate).toLocaleDateString('vi-VN')}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Trạng thái
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={profile.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Statistics Card */}
                    <Card className="shadow-sm border-0 mt-4">
                        <Card.Header className="bg-white border-bottom py-3">
                            <h6 className="mb-0">Thống Kê Công Việc</h6>
                        </Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                <Col md={3}>
                                    <div className="p-3">
                                        <h3 className="text-primary mb-1">45</h3>
                                        <small className="text-muted">Check-in tuần này</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="p-3">
                                        <h3 className="text-success mb-1">12</h3>
                                        <small className="text-muted">Hôm nay</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="p-3">
                                        <h3 className="text-warning mb-1">8</h3>
                                        <small className="text-muted">Voucher tạo</small>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="p-3">
                                        <h3 className="text-info mb-1">15</h3>
                                        <small className="text-muted">Sân quản lý</small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StaffProfile;
