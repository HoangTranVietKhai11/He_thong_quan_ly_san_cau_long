import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { BiCalendar, BiTime, BiDollar, BiUser, BiPhone, BiCheck } from 'react-icons/bi';

const CounterBooking = () => {
    const [bookingData, setBookingData] = useState({
        date: new Date().toISOString().split('T')[0],
        timeSlot: '',
        courtId: '',
        customerName: '',
        customerPhone: '',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
    });

    const [availableCourts, setAvailableCourts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Time slots (6h - 23h)
    const timeSlots = [];
    for (let hour = 6; hour < 23; hour++) {
        timeSlots.push({
            id: `${hour}:00-${hour + 1}:00`,
            label: `${hour}:00 - ${hour + 1}:00`,
            price: hour >= 17 && hour < 21 ? 120000 : 80000 // Giờ cao điểm vs thường
        });
    }

    const courts = [
        { id: 1, name: 'Sân 1', status: 'available' },
        { id: 2, name: 'Sân 2', status: 'available' },
        { id: 3, name: 'Sân 3', status: 'in_use' },
        { id: 4, name: 'Sân 4', status: 'available' },
        { id: 5, name: 'Sân 5', status: 'available' },
        { id: 6, name: 'Sân 6', status: 'maintenance' },
        { id: 7, name: 'Sân 7', status: 'available' },
        { id: 8, name: 'Sân 8', status: 'available' }
    ];

    const handleTimeSlotSelect = (slot) => {
        setBookingData({ ...bookingData, timeSlot: slot.id });
        setTotalPrice(slot.price);
        // Show available courts for this time
        const available = courts.filter(c => c.status === 'available');
        setAvailableCourts(available);
    };

    const handleCreateBooking = (e) => {
        e.preventDefault();
        // Simulate booking creation
        console.log('Creating booking:', bookingData);
        setShowSuccess(true);

        // Reset form after 2 seconds
        setTimeout(() => {
            setBookingData({
                date: new Date().toISOString().split('T')[0],
                timeSlot: '',
                courtId: '',
                customerName: '',
                customerPhone: '',
                paymentStatus: 'paid',
                paymentMethod: 'cash'
            });
            setAvailableCourts([]);
            setTotalPrice(0);
            setShowSuccess(false);
        }, 2000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Đặt sân tại quầy</h2>
                <p className="text-muted">Hỗ trợ khách hàng đặt sân trực tiếp</p>
            </div>

            {showSuccess && (
                <Alert variant="success" className="mb-4">
                    <BiCheck size={20} className="me-2" />
                    Đặt sân thành công! Booking đã được tạo.
                </Alert>
            )}

            <Form onSubmit={handleCreateBooking}>
                <Row>
                    {/* Left Column - Booking Details */}
                    <Col lg={8}>
                        {/* Date Selection */}
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-bottom">
                                <h6 className="mb-0">
                                    <BiCalendar className="me-2" />
                                    Chọn ngày
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <Form.Control
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </Card.Body>
                        </Card>

                        {/* Time Slot Selection */}
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-bottom">
                                <h6 className="mb-0">
                                    <BiTime className="me-2" />
                                    Chọn khung giờ
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <Row className="g-2">
                                    {timeSlots.map((slot) => (
                                        <Col md={3} key={slot.id}>
                                            <Button
                                                variant={bookingData.timeSlot === slot.id ? 'primary' : 'outline-primary'}
                                                className="w-100"
                                                onClick={() => handleTimeSlotSelect(slot)}
                                            >
                                                <div>{slot.label}</div>
                                                <small>{formatPrice(slot.price)}</small>
                                            </Button>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Court Selection */}
                        {availableCourts.length > 0 && (
                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Header className="bg-white border-bottom">
                                    <h6 className="mb-0">Chọn sân (Có {availableCourts.length} sân trống)</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="g-2">
                                        {availableCourts.map((court) => (
                                            <Col md={3} key={court.id}>
                                                <Button
                                                    variant={bookingData.courtId === court.id ? 'success' : 'outline-success'}
                                                    className="w-100"
                                                    onClick={() => setBookingData({ ...bookingData, courtId: court.id })}
                                                >
                                                    {court.name}
                                                </Button>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Customer Information */}
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white border-bottom">
                                <h6 className="mb-0">
                                    <BiUser className="me-2" />
                                    Thông tin khách hàng
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tên khách hàng</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên"
                                                value={bookingData.customerName}
                                                onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="0901234567"
                                                value={bookingData.customerPhone}
                                                onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column -Summary & Payment */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm mb-3 sticky-top" style={{ top: '20px' }}>
                            <Card.Header className="bg-primary text-white">
                                <h6 className="mb-0">
                                    <BiDollar className="me-2" />
                                    Tóm tắt đặt sân
                                </h6>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <small className="text-muted">Ngày:</small>
                                    <div className="fw-bold">
                                        {bookingData.date ? new Date(bookingData.date).toLocaleDateString('vi-VN') : '---'}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted">Giờ:</small>
                                    <div className="fw-bold">{bookingData.timeSlot || '---'}</div>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted">Sân:</small>
                                    <div className="fw-bold">
                                        {bookingData.courtId ? `Sân ${bookingData.courtId}` : '---'}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted">Khách hàng:</small>
                                    <div className="fw-bold">{bookingData.customerName || '---'}</div>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted">SĐT:</small>
                                    <div className="fw-bold">{bookingData.customerPhone || '---'}</div>
                                </div>

                                <hr />

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Thành tiền:</span>
                                        <h4 className="mb-0 text-primary">{formatPrice(totalPrice)}</h4>
                                    </div>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Thanh toán</Form.Label>
                                    <Form.Select
                                        value={bookingData.paymentStatus}
                                        onChange={(e) => setBookingData({ ...bookingData, paymentStatus: e.target.value })}
                                    >
                                        <option value="paid">Đã thanh toán</option>
                                        <option value="pending">Chưa thanh toán</option>
                                    </Form.Select>
                                </Form.Group>

                                {bookingData.paymentStatus === 'paid' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small">Phương thức</Form.Label>
                                        <Form.Select
                                            value={bookingData.paymentMethod}
                                            onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                                        >
                                            <option value="cash">Tiền mặt</option>
                                            <option value="card">Thẻ</option>
                                            <option value="transfer">Chuyển khoản</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 py-2"
                                    size="lg"
                                    disabled={!bookingData.courtId || !bookingData.customerName || !bookingData.customerPhone}
                                >
                                    <BiCheck size={24} className="me-2" />
                                    Tạo booking
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default CounterBooking;
