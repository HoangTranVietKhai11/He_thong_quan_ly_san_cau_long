import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { FiTag, FiPlus, FiEdit, FiToggleLeft, FiToggleRight, FiPercent, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { mockVouchers } from '../../utils/mockData';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState(mockVouchers);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount: '',
        discountType: 'percentage',
        minBookingAmount: '',
        maxDiscount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: ''
    });

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discount: '',
            discountType: 'percentage',
            minBookingAmount: '',
            maxDiscount: '',
            validFrom: '',
            validUntil: '',
            usageLimit: ''
        });
    };

    const handleCreate = () => {
        const newVoucher = {
            id: vouchers.length + 1,
            ...formData,
            discount: Number(formData.discount),
            minBookingAmount: Number(formData.minBookingAmount),
            maxDiscount: Number(formData.maxDiscount),
            usageLimit: Number(formData.usageLimit),
            usedCount: 0,
            status: 'active',
            applicableTo: 'all'
        };
        setVouchers([...vouchers, newVoucher]);
        setShowCreateModal(false);
        resetForm();
    };

    const handleEdit = (voucher) => {
        setSelectedVoucher(voucher);
        setFormData({
            code: voucher.code,
            description: voucher.description,
            discount: voucher.discount.toString(),
            discountType: voucher.discountType,
            minBookingAmount: voucher.minBookingAmount.toString(),
            maxDiscount: voucher.maxDiscount.toString(),
            validFrom: voucher.validFrom,
            validUntil: voucher.validUntil,
            usageLimit: voucher.usageLimit.toString()
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setVouchers(vouchers.map(v =>
            v.id === selectedVoucher.id
                ? {
                    ...v,
                    ...formData,
                    discount: Number(formData.discount),
                    minBookingAmount: Number(formData.minBookingAmount),
                    maxDiscount: Number(formData.maxDiscount),
                    usageLimit: Number(formData.usageLimit)
                }
                : v
        ));
        setShowEditModal(false);
        resetForm();
    };

    const toggleVoucherStatus = (voucherId) => {
        setVouchers(vouchers.map(v =>
            v.id === voucherId
                ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' }
                : v
        ));
    };

    const getStatusBadge = (status) => {
        return status === 'active'
            ? <Badge bg="success">Hoạt động</Badge>
            : <Badge bg="secondary">Không hoạt động</Badge>;
    };

    const renderVoucherCard = (voucher) => {
        const isActive = voucher.status === 'active';
        const usagePercent = (voucher.usedCount / voucher.usageLimit) * 100;

        return (
            <Col lg={6} xl={4} key={voucher.id} className="mb-4">
                <Card className={`h-100 ${isActive ? '' : 'opacity-75'}`}>
                    <div
                        className="p-3"
                        style={{
                            background: isActive
                                ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                                : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                            borderBottom: `3px solid ${isActive ? '#f59e0b' : '#9ca3af'}`
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <Badge
                                    bg={isActive ? 'warning' : 'secondary'}
                                    text="dark"
                                    style={{ fontSize: '14px' }}
                                >
                                    {voucher.code}
                                </Badge>
                            </div>
                            <div>{getStatusBadge(voucher.status)}</div>
                        </div>

                        <h3 className="mb-0 text-dark">
                            {voucher.discountType === 'percentage' ? (
                                <>
                                    <FiPercent className="me-1" size={28} />
                                    {voucher.discount}%
                                </>
                            ) : (
                                <>
                                    <FiDollarSign className="me-1" size={28} />
                                    {(voucher.discount / 1000).toFixed(0)}K
                                </>
                            )}
                        </h3>
                        <small className="text-dark opacity-75">Giảm giá</small>
                    </div>

                    <Card.Body>
                        <p className="mb-3">{voucher.description}</p>

                        <div className="small mb-3">
                            <div className="mb-2">
                                <strong>Điều kiện:</strong> Đơn tối thiểu {voucher.minBookingAmount?.toLocaleString('vi-VN')} ₫
                            </div>
                            {voucher.maxDiscount && (
                                <div className="mb-2">
                                    <strong>Giảm tối đa:</strong> {voucher.maxDiscount?.toLocaleString('vi-VN')} ₫
                                </div>
                            )}
                            <div className="mb-2">
                                <FiCalendar className="me-1" />
                                <strong>Hiệu lực:</strong> {voucher.validFrom} đến {voucher.validUntil}
                            </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                                <span>Đã sử dụng</span>
                                <span>{voucher.usedCount} / {voucher.usageLimit}</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: `${usagePercent}%` }}
                                    aria-valuenow={usagePercent}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="flex-grow-1"
                                onClick={() => handleEdit(voucher)}
                            >
                                <FiEdit className="me-1" />
                                Sửa
                            </Button>
                            <Button
                                variant={isActive ? 'outline-secondary' : 'outline-success'}
                                size="sm"
                                className="flex-grow-1"
                                onClick={() => toggleVoucherStatus(voucher.id)}
                            >
                                {isActive ? (
                                    <>
                                        <FiToggleRight className="me-1" />
                                        Tắt
                                    </>
                                ) : (
                                    <>
                                        <FiToggleLeft className="me-1" />
                                        Bật
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    const activeVouchers = vouchers.filter(v => v.status === 'active');
    const inactiveVouchers = vouchers.filter(v => v.status !== 'active');

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        <FiTag className="me-2 text-warning" />
                        Quản Lý Voucher
                    </h3>
                    <p className="text-muted mb-0">Tạo và quản lý voucher giảm giá</p>
                </div>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <FiPlus className="me-2" />
                    Tạo Voucher Mới
                </Button>
            </div>

            {/* Stats */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm border-start-success">
                        <Card.Body className="text-center">
                            <h4 className="text-success mb-1">{activeVouchers.length}</h4>
                            <div className="small text-muted">Voucher đang hoạt động</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm border-start border-start-secondary">
                        <Card.Body className="text-center">
                            <h4 className="text-secondary mb-1">{inactiveVouchers.length}</h4>
                            <div className="small text-muted">Voucher không hoạt động</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm border-start-warning">
                        <Card.Body className="text-center">
                            <h4 className="text-warning mb-1">
                                {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
                            </h4>
                            <div className="small text-muted">Tổng lượt sử dụng</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Active Vouchers */}
            {activeVouchers.length > 0 && (
                <div className="mb-5">
                    <h5 className="mb-3">
                        <Badge bg="success" className="me-2">{activeVouchers.length}</Badge>
                        Voucher Hoạt Động
                    </h5>
                    <Row>
                        {activeVouchers.map(voucher => renderVoucherCard(voucher))}
                    </Row>
                </div>
            )}

            {/* Inactive Vouchers */}
            {inactiveVouchers.length > 0 && (
                <div>
                    <h5 className="mb-3">
                        <Badge bg="secondary" className="me-2">{inactiveVouchers.length}</Badge>
                        Voucher Không Hoạt Động
                    </h5>
                    <Row>
                        {inactiveVouchers.map(voucher => renderVoucherCard(voucher))}
                    </Row>
                </div>
            )}

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FiPlus className="me-2 text-primary" />
                        Tạo Voucher Mới
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã voucher *</Form.Label>
                                    <Form.Control
                                        placeholder="VD: WELCOME10"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại giảm giá *</Form.Label>
                                    <Form.Select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Phần trăm (%)</option>
                                        <option value="fixed">Số tiền cố định (₫)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả *</Form.Label>
                            <Form.Control
                                placeholder="VD: Giảm 10% cho khách hàng mới"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá trị giảm *</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        />
                                        <InputGroup.Text>
                                            {formData.discountType === 'percentage' ? '%' : '₫'}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Đơn tối thiểu (₫) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="100000"
                                        value={formData.minBookingAmount}
                                        onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giảm tối đa (₫)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="50000"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày bắt đầu *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày kết thúc *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giới hạn sử dụng *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="100"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        <FiPlus className="me-2" />
                        Tạo Voucher
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FiEdit className="me-2 text-primary" />
                        Chỉnh Sửa Voucher
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Same form as Create Modal */}
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã voucher</Form.Label>
                                    <Form.Control
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại giảm giá</Form.Label>
                                    <Form.Select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Phần trăm (%)</option>
                                        <option value="fixed">Số tiền cố định (₫)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá trị giảm</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        />
                                        <InputGroup.Text>
                                            {formData.discountType === 'percentage' ? '%' : '₫'}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Đơn tối thiểu (₫)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.minBookingAmount}
                                        onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giảm tối đa (₫)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày bắt đầu</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày kết thúc</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        <FiEdit className="me-2" />
                        Lưu Thay Đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Vouchers;
