import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { BiSearch, BiDollar, BiPrinter, BiCheck } from 'react-icons/bi';
import checkinService from '../../services/checkinService';
import bookingService from '../../services/bookingService';

const CounterPayment = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [amountReceived, setAmountReceived] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            setLoading(true);
            setError('');
            const res = await checkinService.searchBooking(searchQuery, 'booking_id');
            const data = res.data || [];
            if (data.length > 0) {
                const booking = data[0];
                setSelectedBooking({
                    id: booking.id,
                    userName: booking.user_name,
                    courtName: booking.court_name,
                    date: booking.booking_date,
                    timeSlot: `${booking.start_time} - ${booking.end_time}`,
                    basePrice: parseFloat(booking.base_price || 0),
                    overtimeFee: parseFloat(booking.overtime_fee || 0),
                    discount: parseFloat(booking.discount_amount || 0),
                    totalPrice: parseFloat(booking.total_price || 0),
                    paymentStatus: booking.payment_status?.toLowerCase() || 'pending'
                });
                setAmountReceived(booking.total_price.toString());
            } else {
                setSelectedBooking(null);
                setError(`Không tìm thấy booking "${searchQuery}"`);
            }
        } catch (err) {
            setError('Lỗi tìm kiếm: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!selectedBooking) return;
        try {
            setConfirming(true);
            await bookingService.updateBookingStatus(selectedBooking.id, 'Paid');
            setShowSuccess(true);
            setTimeout(() => {
                setSearchQuery('');
                setSelectedBooking(null);
                setAmountReceived('');
                setShowSuccess(false);
            }, 3000);
        } catch (err) {
            setError('Lỗi xác nhận thanh toán: ' + (err.response?.data?.message || err.message));
        } finally {
            setConfirming(false);
        }
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
                <p className="text-muted">Thu tiền và xác nhận thanh toán cho các booking trả sau</p>
            </div>

            {showSuccess && <Alert variant="success" className="mb-4"><BiCheck size={20} className="me-2" />Thanh toán thành công! Trạng thái booking đã được cập nhật.</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Row>
                <Col lg={5}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-bottom"><h6 className="mb-0">Tìm kiếm booking</h6></Card.Header>
                        <Card.Body>
                            <InputGroup className="mb-3">
                                <InputGroup.Text><BiSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Nhập mã booking"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button variant="primary" onClick={handleSearch} disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : 'Tìm'}
                                </Button>
                            </InputGroup>

                            {selectedBooking && (
                                <Card className="border">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h6 className="mb-1">Booking #{selectedBooking.id}</h6>
                                                <Badge bg={selectedBooking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                                                    {selectedBooking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="small mb-2"><strong>Khách hàng:</strong> {selectedBooking.userName}</div>
                                        <div className="small mb-2"><strong>Sân:</strong> {selectedBooking.courtName}</div>
                                        <div className="small mb-2"><strong>Ngày:</strong> {selectedBooking.date}</div>
                                        <div className="small mb-2"><strong>Giờ:</strong> {selectedBooking.timeSlot}</div>
                                        <hr />
                                        <div className="d-flex justify-content-between mb-1"><span>Giá cơ bản:</span><span>{formatPrice(selectedBooking.basePrice)}</span></div>
                                        {selectedBooking.overtimeFee > 0 && <div className="d-flex justify-content-between mb-1 text-warning"><span>Phí quá giờ:</span><span>{formatPrice(selectedBooking.overtimeFee)}</span></div>}
                                        {selectedBooking.discount > 0 && <div className="d-flex justify-content-between mb-1 text-success"><span>Giảm giá:</span><span>-{formatPrice(selectedBooking.discount)}</span></div>}
                                        <hr /><div className="d-flex justify-content-between"><strong>Tổng cộng:</strong><h5 className="mb-0 text-primary">{formatPrice(selectedBooking.totalPrice)}</h5></div>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7}>
                    {selectedBooking && selectedBooking.paymentStatus !== 'paid' ? (
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-primary text-white"><h6 className="mb-0"><BiDollar className="me-2" />Xử lý thanh toán</h6></Card.Header>
                            <Card.Body className="p-4">
                                <Alert variant="info" className="mb-4"><BiDollar size={20} className="me-2" />Số tiền cần thu: <strong>{formatPrice(selectedBooking.totalPrice)}</strong></Alert>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Phương thức thanh toán</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" className="flex-grow-1 py-2">Tiền mặt</Button>
                                        <Button variant="outline-primary" className="flex-grow-1 py-2">Thẻ/Chuyển khoản</Button>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Số tiền khách đưa</Form.Label>
                                    <InputGroup size="lg">
                                        <Form.Control type="number" placeholder="Nhập số tiền" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} />
                                        <InputGroup.Text>₫</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                {amountReceived && parseInt(amountReceived) >= selectedBooking.totalPrice && (
                                    <Alert variant="success"><div className="d-flex justify-content-between align-items-center"><span>Tiền thừa trả khách:</span><h4 className="mb-0">{formatPrice(calculateChange())}</h4></div></Alert>
                                )}
                                <div className="d-flex gap-2">
                                    <Button variant="success" className="flex-grow-1 py-3 fw-bold" size="lg" onClick={handleConfirmPayment} disabled={confirming || !amountReceived || parseInt(amountReceived) < selectedBooking.totalPrice}>
                                        {confirming ? <Spinner size="sm" className="me-2" /> : <BiCheck size={24} className="me-2" />}XÁC NHẬN THANH TOÁN
                                    </Button>
                                    <Button variant="outline-secondary" className="px-4 py-3"><BiPrinter size={20} /></Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="border-0 shadow-sm"><Card.Body className="text-center py-5"><BiSearch size={64} className="text-muted mb-3 opacity-25" /><h6>Tìm kiếm booking để thanh toán</h6></Card.Body></Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CounterPayment;
