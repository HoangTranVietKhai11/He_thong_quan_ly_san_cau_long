import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { BiSave, BiBuilding, BiPhone, BiTime, BiMap } from 'react-icons/bi';
import FACILITY_INFO from '../../config/facility';

const Settings = () => {
    const [facilityData, setFacilityData] = useState({
        name: FACILITY_INFO.name,
        shortName: FACILITY_INFO.shortName,
        address: FACILITY_INFO.address,
        phone: FACILITY_INFO.phone,
        email: FACILITY_INFO.email,
        openTime: FACILITY_INFO.openTime,
        closeTime: FACILITY_INFO.closeTime,
        description: FACILITY_INFO.description,
        owner: FACILITY_INFO.owner,
        facebook: FACILITY_INFO.facebook,
        instagram: FACILITY_INFO.instagram,
        mapUrl: FACILITY_INFO.mapUrl
    });

    const [features, setFeatures] = useState(FACILITY_INFO.features.join('\n'));
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFacilityData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // In a real app, this would save to backend
        console.log('Saving facility settings:', {
            ...facilityData,
            features: features.split('\n').filter(f => f.trim())
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Cài Đặt Cơ Sở</h2>
                <p className="text-muted">Quản lý thông tin và cấu hình của {FACILITY_INFO.shortName}</p>
            </div>

            {showSuccess && (
                <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
                    Đã lưu thành công!
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <div className="d-flex align-items-center">
                            <BiBuilding className="me-2 text-primary" size={20} />
                            <h5 className="mb-0">Thông Tin Cơ Bản</h5>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Tên cơ sở *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={facilityData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Tên viết tắt</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shortName"
                                        value={facilityData.shortName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={facilityData.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Chủ sở hữu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="owner"
                                        value={facilityData.owner}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Contact Information */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <div className="d-flex align-items-center">
                            <BiPhone className="me-2 text-primary" size={20} />
                            <h5 className="mb-0">Thông Tin Liên Hệ</h5>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Địa chỉ *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={facilityData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Số điện thoại *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={facilityData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={facilityData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Link Google Maps</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="mapUrl"
                                        value={facilityData.mapUrl}
                                        onChange={handleChange}
                                        placeholder="https://maps.google.com/?q=..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Operating Hours */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <div className="d-flex align-items-center">
                            <BiTime className="me-2 text-primary" size={20} />
                            <h5 className="mb-0">Giờ Hoạt Động</h5>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Giờ mở cửa *</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="openTime"
                                        value={facilityData.openTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Giờ đóng cửa *</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="closeTime"
                                        value={facilityData.closeTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Social Media */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <div className="d-flex align-items-center">
                            <BiMap className="me-2 text-primary" size={20} />
                            <h5 className="mb-0">Mạng Xã Hội</h5>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Facebook</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="facebook"
                                        value={facilityData.facebook}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Instagram</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="instagram"
                                        value={facilityData.instagram}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Features */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <h5 className="mb-0">Tiện Ích & Dịch Vụ</h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <Form.Group>
                            <Form.Label>Danh sách tiện ích (mỗi dòng một tiện ích)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={features}
                                onChange={(e) => setFeatures(e.target.value)}
                                placeholder="Sân thi đấu chuẩn quốc tế&#10;Wifi miễn phí&#10;Bãi đỗ xe rộng rãi"
                            />
                            <Form.Text className="text-muted">
                                Mỗi dòng sẽ là một tiện ích riêng biệt
                            </Form.Text>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Save Button */}
                <div className="d-flex gap-2 justify-content-end">
                    <Button variant="outline-secondary">Hủy</Button>
                    <Button variant="primary" type="submit">
                        <BiSave className="me-2" />
                        Lưu Thay Đổi
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Settings;
