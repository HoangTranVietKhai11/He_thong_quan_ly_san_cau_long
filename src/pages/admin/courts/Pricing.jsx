import React, { useState } from 'react';
import { Container, Card, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { BiEdit, BiSave, BiX } from 'react-icons/bi';
import { mockCourtPricing } from '../../../utils/mockAdminData';

const CourtPricing = () => {
    const [editMode, setEditMode] = useState(false);
    const [priceMatrix, setPriceMatrix] = useState(mockCourtPricing.priceMatrix);
    const [pricingTiers, setPricingTiers] = useState(mockCourtPricing.pricingTiers);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleSave = () => {
        // TODO: Save to backend
        setEditMode(false);
        alert('Đã lưu cấu hình giá thành công!');
    };

    const handleCancel = () => {
        setPriceMatrix(mockCourtPricing.priceMatrix);
        setEditMode(false);
    };

    const handleTierChange = (slotId, tier) => {
        setPriceMatrix({
            ...priceMatrix,
            [slotId]: tier
        });
    };

    const handlePriceChange = (tier, newPrice) => {
        setPricingTiers({
            ...pricingTiers,
            [tier]: {
                ...pricingTiers[tier],
                price: parseInt(newPrice) || 0
            }
        });
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Giá sân theo giờ</h2>
                    <p className="text-muted">Thiết lập đơn giá theo khung giờ và loại sân</p>
                </div>
                <div>
                    {!editMode ? (
                        <Button variant="primary" onClick={() => setEditMode(true)}>
                            <BiEdit className="me-2" />
                            Chỉnh sửa giá
                        </Button>
                    ) : (
                        <>
                            <Button variant="success" className="me-2" onClick={handleSave}>
                                <BiSave className="me-2" />
                                Lưu thay đổi
                            </Button>
                            <Button variant="secondary" onClick={handleCancel}>
                                <BiX className="me-2" />
                                Hủy
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Pricing Tiers Configuration */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0 fw-bold">Cấu hình mức giá</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {Object.entries(pricingTiers).map(([key, tier]) => (
                                    <Col md={4} key={key}>
                                        <Card className="border h-100" style={{ borderColor: tier.color }}>
                                            <Card.Body>
                                                <div className="d-flex align-items-center mb-3">
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            backgroundColor: tier.color,
                                                            borderRadius: '4px',
                                                            marginRight: '10px'
                                                        }}
                                                    />
                                                    <h6 className="mb-0 fw-bold">{tier.name}</h6>
                                                </div>
                                                {editMode ? (
                                                    <Form.Group>
                                                        <Form.Label className="small">Đơn giá (VNĐ/giờ)</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            value={tier.price}
                                                            onChange={(e) => handlePriceChange(key, e.target.value)}
                                                            step="10000"
                                                        />
                                                    </Form.Group>
                                                ) : (
                                                    <div>
                                                        <small className="text-muted d-block">Đơn giá</small>
                                                        <h4 className="mb-0 fw-bold text-primary">
                                                            {formatPrice(tier.price)}
                                                        </h4>
                                                        <small className="text-muted">/giờ</small>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Time Slot Matrix */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 fw-bold">Ma trận giá theo khung giờ</h5>
                    <small className="text-muted">Chọn mức giá cho từng khung giờ trong ngày</small>
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="fw-bold">#</th>
                                    <th className="fw-bold">Khung giờ</th>
                                    <th className="fw-bold">Mức giá</th>
                                    <th className="fw-bold">Đơn giá</th>
                                    {editMode && <th className="fw-bold">Thay đổi</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {mockCourtPricing.timeSlots.map((slot) => {
                                    const tier = priceMatrix[slot.id];
                                    const tierInfo = pricingTiers[tier];

                                    return (
                                        <tr key={slot.id}>
                                            <td className="align-middle">{slot.id}</td>
                                            <td className="align-middle">
                                                <strong>{slot.label}</strong>
                                            </td>
                                            <td className="align-middle">
                                                <Badge
                                                    bg="light"
                                                    text="dark"
                                                    style={{
                                                        borderLeft: `4px solid ${tierInfo.color}`,
                                                        padding: '8px 12px'
                                                    }}
                                                >
                                                    {tierInfo.name}
                                                </Badge>
                                            </td>
                                            <td className="align-middle">
                                                <strong className="text-primary">
                                                    {formatPrice(tierInfo.price)}
                                                </strong>
                                            </td>
                                            {editMode && (
                                                <td className="align-middle">
                                                    <Form.Select
                                                        size="sm"
                                                        value={tier}
                                                        onChange={(e) => handleTierChange(slot.id, e.target.value)}
                                                        style={{ width: '200px' }}
                                                    >
                                                        {Object.entries(pricingTiers).map(([key, t]) => (
                                                            <option key={key} value={key}>
                                                                {t.name} - {formatPrice(t.price)}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Statistics */}
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Tổng khung giờ</div>
                            <h3 className="fw-bold mb-0">{mockCourtPricing.timeSlots.length}</h3>
                            <small className="text-muted">khung giờ/ngày</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Giá trung bình</div>
                            <h3 className="fw-bold mb-0 text-primary">
                                {formatPrice(
                                    Object.values(pricingTiers).reduce((sum, t) => sum + t.price, 0) / 3
                                )}
                            </h3>
                            <small className="text-muted">/giờ</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Doanh thu ước tính</div>
                            <h3 className="fw-bold mb-0 text-success">
                                {formatPrice(
                                    mockCourtPricing.timeSlots.length *
                                    (Object.values(pricingTiers).reduce((sum, t) => sum + t.price, 0) / 3) *
                                    8 // 8 courts
                                )}
                            </h3>
                            <small className="text-muted">/ngày (8 sân)</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CourtPricing;
