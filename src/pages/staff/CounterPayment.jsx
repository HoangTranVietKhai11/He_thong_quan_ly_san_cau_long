import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert } from 'react-bootstrap';
import { BiSearch, BiDollar, BiPrinter, BiCheck } from 'react-icons/bi';

const CounterPayment = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [amountReceived, setAmountReceived] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock booking data
    const mockBookings = [
        {
            id: 'BK001',
            userName: 'Nguyễn Văn A',
            courtName: 'Sân 1',
            date: '2026-02-05',
            timeSlot: '18:00 - 19:00',
            basePrice: 120000,
            overtimeFee: 0,
            discount: 0,
            totalPrice: 120000,
            paymentStatus: 'pending'
        },
        {
            id: 'BK003',
            userName: 'Lê Văn C',
            courtName: 'Sân 5',
            date: '2026-02-03',
            timeSlot: '20:00 - 21:00',
            basePrice: 120000,
            overtimeFee: 20000, // 5 phút quá giờ
            discount: 0,
            totalPrice: 140000,
            paymentStatus: 'pending'
        }
    ];

    const handleSearch = () => {
        const booking = mockBookings.find(b =>
            b.id === searchQuery || b.userName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSelectedBooking(booking || null);
        if (booking) {
            setAmountReceived(booking.totalPrice.toString());
        }
    };

    const handleConfirmPayment = () => {
        if (!selectedBooking) return;

        console.log('Processing payment for:', selectedBooking.id);
        setShowSuccess(true);

        setTimeout(() => {
            setSearchQuery('');
            setSelectedBooking(null);
            setAmountReceived('');
            setShowSuccess(false);
        }, 3000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const calculateChange = () => {
        if (!selectedBooking || !amountReceived) return 0;
        return Math.max(0, parseInt(amountReceived) - selectedBooking.totalPrice);
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Thanh toán tại quầy</h2>
                <p className="text-muted">Thu tiền và xác nhận thanh toán</p>
            </div>

            {showSuccess && (
                <Alert variant="success" className="mb-4">
                    <BiCheck size={20} className="me-2" />
                    Thanh toán thành công! Booking đã được cập nhật.
                </Alert>
            )}

            <Row>
                {/* Search Section */}
                <Col lg={5}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0">Tìm kiếm booking</h6>
                        </Card.Header>
                        <Card.Body>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <BiSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Nhập mã booking hoặc tên khách"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button variant="primary" onClick={handleSearch}>
                                    Tìm
                                </Button>
                            </InputGroup>

                            {selectedBooking && (
                                <Card className="border">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h6 className="mb-1">{selectedBooking.id}</h6>
                                                <Badge bg={selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                                                    {selectedBooking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="small mb-2">
                                            <strong>Khách hàng:</strong> {selectedBooking.userName}
                                        </div>
                                        <div className="small mb-2">
                                            <strong>Sân:</strong> {selectedBooking.courtName}
                                        </div>
                                        <div className="small mb-2">
                                            <strong>Ngày:</strong> {new Date(selectedBooking.date).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="small mb-2">
                                            <strong>Giờ:</strong> {selectedBooking.timeSlot}
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Giá cơ bản:</span>
                                            <span>{formatPrice(selectedBooking.basePrice)}</span>
                                        </div>
                                        {selectedBooking.overtimeFee > 0 && (
                                            <div className="d-flex justify-content-between mb-1 text-warning">
                                                <span>Phí quá giờ:</span>
                                                <span>{formatPrice(selectedBooking.overtimeFee)}</span>
                                            </div>
                                        )}
                                        {selectedBooking.discount > 0 && (
                                            <div className="d-flex justify-content-between mb-1 text-success">
                                                <span>Giảm giá:</span>
                                                <span>-{formatPrice(selectedBooking.discount)}</span>
                                            </div>
                                        )}
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <strong>Tổng cộng:</strong>
                                            <h5 className="mb-0 text-primary">{formatPrice(selectedBooking.totalPrice)}</h5>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}

                            {searchQuery && !selectedBooking && (
                                <Alert variant="warning">
                                    Không tìm thấy booking "{searchQuery}"
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Payment Section */}
                <Col lg={7}>
                    {selectedBooking && selectedBooking.paymentStatus === 'pending' ? (
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h6 className="mb-0">
                                    <BiDollar className="me-2" />
                                    Xử lý thanh toán
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Alert variant="info" className="mb-4">
                                    <BiDollar size={20} className="me-2" />
                                    Số tiền cần thu: <strong>{formatPrice(selectedBooking.totalPrice)}</strong>
                                </Alert>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Phương thức thanh toán</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" className="flex-1">
                                            Tiền mặt
                                        </Button>
                                        <Button variant="outline-primary" className="flex-1">
                                            Thẻ
                                        </Button>
                                        <Button variant="outline-primary" className="flex-1">
                                            Chuyển khoản
                                        </Button>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Số tiền nhận được</Form.Label>
                                    <InputGroup size="lg">
                                        <Form.Control
                                            type="number"
                                            placeholder="Nhập số tiền"
                                            value={amountReceived}
                                            onChange={(e) => setAmountReceived(e.target.value)}
                                        />
                                        <InputGroup.Text>₫</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>

                                {amountReceived && parseInt(amountReceived) >= selectedBooking.totalPrice && (
                                    <Alert variant="success">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>Tiền thừa trả khách:</span>
                                            <h4 className="mb-0">{formatPrice(calculateChange())}</h4>
                                        </div>
                                    </Alert>
                                )}

                                {amountReceived && parseInt(amountReceived) < selectedBooking.totalPrice && (
                                    <Alert variant="danger">
                                        Số tiền nhận được chưa đủ!
                                    </Alert>
                                )}

                                <div className="d-flex gap-2">
                                    <Button
                                        variant="success"
                                        className="flex-1 py-3"
                                        size="lg"
                                        onClick={handleConfirmPayment}
                                        disabled={!amountReceived || parseInt(amountReceived) < selectedBooking.totalPrice}
                                    >
                                        <BiCheck size={24} className="me-2" />
                                        Xác nhận thanh toán
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        className="py-3"
                                        size="lg"
                                    >
                                        <BiPrinter size={20} className="me-2" />
                                        In hóa đơn
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center py-5">
                                <BiSearch size={64} className="text-muted mb-3 opacity-25" />
                                <h6 className="text-muted">Tìm kiếm booking để thanh toán</h6>
                                <p className="text-muted small">Nhập mã booking hoặc tên khách hàng bên trái</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CounterPayment;
