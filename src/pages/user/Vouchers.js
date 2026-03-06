import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, InputGroup, Form, Alert } from 'react-bootstrap';
import { FiTag, FiCopy, FiCheck, FiPercent, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { mockVouchers, mockUserVouchers } from '../../utils/mockData';

const Vouchers = () => {
    const [userVouchers, setUserVouchers] = useState([]);
    const [allVouchers, setAllVouchers] = useState([]);
    const [copiedCode, setCopiedCode] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [addMessage, setAddMessage] = useState('');

    useEffect(() => {
        // Load user's vouchers
        const vouchers = mockUserVouchers.map(uv => {
            const voucherDetails = mockVouchers.find(v => v.id === uv.voucherId);
            return { ...uv, ...voucherDetails };
        });
        setUserVouchers(vouchers);

        // Load all available vouchers to collect
        setAllVouchers(mockVouchers.filter(v => v.status === 'active'));
    }, []);

    const copyVoucherCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const addVoucher = () => {
        if (!voucherCode.trim()) {
            setAddMessage('error:Vui lòng nhập mã voucher');
            return;
        }

        // Check if voucher exists
        const voucher = mockVouchers.find(v => v.code === voucherCode.trim().toUpperCase());
        if (!voucher) {
            setAddMessage('error:Mã voucher không tồn tại');
            return;
        }

        // Check if already added
        const alreadyHas = userVouchers.find(uv => uv.code === voucherCode.trim().toUpperCase());
        if (alreadyHas) {
            setAddMessage('error:Bạn đã có voucher này');
            return;
        }

        setAddMessage('success:Thêm voucher thành công!');
        setVoucherCode('');
        setTimeout(() => setAddMessage(''), 3000);
    };

    const renderVoucherCard = (voucher, isUserVoucher = false) => {
        const isUsed = isUserVoucher && voucher.status === 'used';
        const isExpired = new Date(voucher.validUntil) < new Date();

        return (
            <Col md={6} lg={4} key={voucher.id || voucher.voucherId}>
                <Card className={`h-100 voucher-card ${isUsed || isExpired ? 'opacity-50' : ''}`}>
                    <div
                        className="voucher-header p-3"
                        style={{
                            background: isUsed || isExpired
                                ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
                                : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            borderBottom: `3px solid ${isUsed || isExpired ? '#9ca3af' : '#f59e0b'}`
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <Badge
                                    bg={isUsed || isExpired ? 'secondary' : 'warning'}
                                    text="dark"
                                    className="mb-2"
                                    style={{ fontSize: '14px' }}
                                >
                                    {voucher.code}
                                </Badge>
                                {isUsed && <Badge bg="danger" className="ms-2">Đã dùng</Badge>}
                                {isExpired && <Badge bg="secondary" className="ms-2">Hết hạn</Badge>}
                            </div>
                            <FiTag size={24} className={isUsed || isExpired ? 'text-secondary' : 'text-warning'} />
                        </div>

                        <div className="discount-amount mb-2">
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
                    </div>

                    <Card.Body>
                        <p className="mb-3">{voucher.description}</p>

                        <div className="voucher-details small text-muted">
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
                                <strong>HSD:</strong> {voucher.validUntil || voucher.expiresAt}
                            </div>
                        </div>

                        {isUserVoucher && !isUsed && !isExpired && (
                            <Button
                                variant="outline-warning"
                                size="sm"
                                className="w-100 mt-3"
                                onClick={() => copyVoucherCode(voucher.code)}
                            >
                                {copiedCode === voucher.code ? (
                                    <>
                                        <FiCheck className="me-1" /> Đã sao chép
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="me-1" /> Sao chép mã
                                    </>
                                )}
                            </Button>
                        )}

                        {isUserVoucher && isUsed && (
                            <div className="text-muted small text-center mt-3">
                                Đã sử dụng: {voucher.usedAt}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    const availableVouchers = userVouchers.filter(v => v.status === 'available');
    const usedVouchers = userVouchers.filter(v => v.status === 'used');

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        <FiTag className="me-2 text-warning" />
                        Voucher của tôi
                    </h3>
                    <p className="text-muted mb-0">Quản lý và sử dụng voucher giảm giá</p>
                </div>
            </div>

            {/* Add Voucher */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body className="p-4">
                    <h6 className="mb-3">Nhập mã voucher</h6>
                    <Row>
                        <Col md={6}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Nhập mã voucher..."
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                />
                                <Button variant="primary" onClick={addVoucher}>
                                    Thêm voucher
                                </Button>
                            </InputGroup>
                            {addMessage && (
                                <Alert
                                    variant={addMessage.startsWith('error:') ? 'danger' : 'success'}
                                    className="mt-3 mb-0"
                                >
                                    {addMessage.replace('error:', '').replace('success:', '')}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Available Vouchers */}
            {availableVouchers.length > 0 && (
                <div className="mb-5">
                    <h5 className="mb-3">
                        <Badge bg="success" className="me-2">{availableVouchers.length}</Badge>
                        Voucher khả dụng
                    </h5>
                    <Row>
                        {availableVouchers.map(voucher => renderVoucherCard(voucher, true))}
                    </Row>
                </div>
            )}

            {/* Used Vouchers */}
            {usedVouchers.length > 0 && (
                <div className="mb-5">
                    <h5 className="mb-3">
                        <Badge bg="secondary" className="me-2">{usedVouchers.length}</Badge>
                        Voucher đã sử dụng
                    </h5>
                    <Row>
                        {usedVouchers.map(voucher => renderVoucherCard(voucher, true))}
                    </Row>
                </div>
            )}

            {/* Available to Collect */}
            <div>
                <h5 className="mb-3">
                    🎁 Voucher có thể nhận
                </h5>
                <Row>
                    {allVouchers.slice(0, 3).map(voucher => renderVoucherCard(voucher, false))}
                </Row>
            </div>
        </Container>
    );
};

export default Vouchers;
