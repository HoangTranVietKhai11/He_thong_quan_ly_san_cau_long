import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Badge, ListGroup } from 'react-bootstrap';
import { BiCreditCard, BiMoney, BiWallet, BiCheckCircle } from 'react-icons/bi';

const Checkout = () => {
    const [selectedMethod, setSelectedMethod] = useState('credit_card');
    
    // Mock data for booking
    const bookingDetails = {
        courtName: 'Sân 1 - Tiêu chuẩn',
        date: '2026-03-15',
        timeSlot: '18:00 - 20:00',
        duration: 2,
        pricePerHour: 120000,
        totalPrice: 240000
    };

    const handlePayment = (e) => {
        e.preventDefault();
        // In real app, this would integrate with a payment gateway (Momo, VNPay, Stripe)
        alert(`Đang xử lý thanh toán qua: ${selectedMethod}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center fw-bold">Thanh Toán Đặt Sân</h2>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm mb-4 border-0">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">Thông tin đơn hàng</h5>
                            <ListGroup variant="flush" className="mb-4">
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span className="text-muted">Sân:</span>
                                    <strong>{bookingDetails.courtName}</strong>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span className="text-muted">Ngày:</span>
                                    <strong>{new Date(bookingDetails.date).toLocaleDateString('vi-VN')}</strong>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span className="text-muted">Khung giờ:</span>
                                    <strong>{bookingDetails.timeSlot} ({bookingDetails.duration} tiếng)</strong>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between px-0 mt-2 border-top-0 pt-3">
                                    <span className="fw-bold fs-5">Tổng tiền:</span>
                                    <strong className="text-primary fs-4">{formatPrice(bookingDetails.totalPrice)}</strong>
                                </ListGroup.Item>
                            </ListGroup>

                            <h5 className="fw-bold mb-3 border-bottom pb-2">Phương thức thanh toán</h5>
                            <Form onSubmit={handlePayment}>
                                <div className="mb-4">
                                    {/* Credit Card */}
                                    <Card className={`mb-2 cursor-pointer transition-all ${selectedMethod === 'credit_card' ? 'border-primary bg-light' : ''}`}
                                          onClick={() => setSelectedMethod('credit_card')}
                                          style={{ cursor: 'pointer' }}>
                                        <Card.Body className="d-flex align-items-center">
                                            <Form.Check 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="pay-card"
                                                checked={selectedMethod === 'credit_card'}
                                                onChange={() => setSelectedMethod('credit_card')}
                                                className="me-3"
                                            />
                                            <BiCreditCard size={24} className="text-primary me-2" />
                                            <div>
                                                <h6 className="mb-0 fw-bold">Thẻ tín dụng / Ghi nợ</h6>
                                                <small className="text-muted">Visa, MasterCard, JCB</small>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* E-Wallet */}
                                    <Card className={`mb-2 cursor-pointer transition-all ${selectedMethod === 'momo' ? 'border-primary bg-light' : ''}`}
                                          onClick={() => setSelectedMethod('momo')}
                                          style={{ cursor: 'pointer' }}>
                                        <Card.Body className="d-flex align-items-center">
                                            <Form.Check 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="pay-momo"
                                                checked={selectedMethod === 'momo'}
                                                onChange={() => setSelectedMethod('momo')}
                                                className="me-3"
                                            />
                                            <BiWallet size={24} className="text-danger me-2" />
                                            <div>
                                                <h6 className="mb-0 fw-bold">Ví điện tử MoMo</h6>
                                                <small className="text-muted">Thanh toán nhanh qua ứng dụng MoMo</small>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Cash / Counter */}
                                    <Card className={`mb-2 cursor-pointer transition-all ${selectedMethod === 'counter' ? 'border-primary bg-light' : ''}`}
                                          onClick={() => setSelectedMethod('counter')}
                                          style={{ cursor: 'pointer' }}>
                                        <Card.Body className="d-flex align-items-center">
                                            <Form.Check 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="pay-counter"
                                                checked={selectedMethod === 'counter'}
                                                onChange={() => setSelectedMethod('counter')}
                                                className="me-3"
                                            />
                                            <BiMoney size={24} className="text-success me-2" />
                                            <div>
                                                <h6 className="mb-0 fw-bold">Thanh toán tại quầy</h6>
                                                <small className="text-muted">Thanh toán tiền mặt trước khi nhận sân</small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" size="lg" type="submit" className="py-3 fw-bold rounded-pill shadow">
                                        Thanh toán {formatPrice(bookingDetails.totalPrice)}
                                    </Button>
                                    <Button variant="light" size="md" className="py-2 text-muted border-0">
                                        Hủy và quay lại
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <div className="text-center text-muted small pb-4">
                        <p className="mb-1"><BiCheckCircle className="me-1 text-success"/> Giao dịch được mã hóa an toàn 256-bit SSL</p>
                        <p>Bằng việc thanh toán, bạn đồng ý với Điều khoản và chính sách hoàn tiền của hệ thống.</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;
