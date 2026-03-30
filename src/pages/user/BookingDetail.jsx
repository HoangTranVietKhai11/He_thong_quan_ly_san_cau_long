import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { BiCalendar, BiTime, BiMap, BiMoney, BiTag, BiCheckCircle, BiXCircle, BiCreditCard } from 'react-icons/bi';
import bookingService from '../../services/bookingService';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await bookingService.getBookingById(id);
                setBooking(res.data?.data || res.data);
            } catch (err) {
                setError('Không thể lấy thông tin đơn đặt sân.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    }

    if (error || !booking) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">{error || 'Không tìm thấy thông tin đơn đặt sân'}</Alert>
                <Button variant="primary" as={Link} to="/user/bookings">Quay lại danh sách</Button>
            </Container>
        );
    }

    const isPaid = booking.status === 'Fully Paid' || booking.status === 'Active';

    return (
        <Container className="py-4 max-w-700" style={{ maxWidth: '700px' }}>
            <div className="d-flex align-items-center mb-4">
                <Button variant="light" onClick={() => navigate(-1)} className="me-3">← Quay lại</Button>
                <h3 className="mb-0 fw-bold">Chi tiết Đặt sân #{booking.id}</h3>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-primary text-white py-3">
                    <h5 className="mb-0 d-flex align-items-center"><BiCheckCircle className="me-2"/> Đặt sân thành công!</h5>
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-4">
                        <Col sm={4} className="text-muted small">Khách hàng</Col>
                        <Col sm={8} className="fw-bold">{booking.user_name || booking.userName || 'Bạn'}</Col>
                    </Row>
                    <Row className="mb-4">
                        <Col sm={4} className="text-muted small">Tên Sân</Col>
                        <Col sm={8} className="fw-bold fs-5 text-primary">{booking.court_name || `Sân ${booking.court_id}`}</Col>
                    </Row>
                    <Row className="mb-4">
                        <Col sm={4} className="text-muted small"><BiCalendar className="me-1"/> Ngày đặt</Col>
                        <Col sm={8}>{new Date(booking.booking_date || booking.date).toLocaleDateString('vi-VN')}</Col>
                    </Row>
                    <Row className="mb-4">
                        <Col sm={4} className="text-muted small"><BiTime className="me-1"/> Thời gian</Col>
                        <Col sm={8} className="fw-bold text-success">
                            {booking.start_time?.substring(0,5)} - {booking.end_time?.substring(0,5)}
                        </Col>
                    </Row>
                    <hr />
                    <Row className="mb-3">
                        <Col sm={6} className="text-muted">Tổng tiền</Col>
                        <Col sm={6} className="text-end fw-bold text-danger fs-4">{formatPrice(booking.total_price)}</Col>
                    </Row>
                    <Row>
                        <Col sm={6} className="text-muted">Trạng thái thanh toán</Col>
                        <Col sm={6} className="text-end">
                            {isPaid ? (
                                <Badge bg="success" className="p-2"><BiCheckCircle className="me-1"/> Đã thanh toán</Badge>
                            ) : (
                                <Badge bg="warning" text="dark" className="p-2"><BiXCircle className="me-1"/> Chưa thanh toán</Badge>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {!isPaid && (
                <Card className="border-0 shadow-sm bg-light">
                    <Card.Body className="text-center p-4">
                        <div className="mb-3 text-muted">Vui lòng thanh toán để giữ sân của bạn.</div>
                        <Button variant="success" size="lg" className="px-5 shadow-sm" onClick={() => navigate(`/user/payment/${booking.id}`)}>
                            <BiCreditCard className="me-2"/> Thanh toán ngay
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default BookingDetail;
