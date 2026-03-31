import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { BiMoney, BiCreditCard, BiCheckCircle, BiTransfer } from 'react-icons/bi';
import bookingService from '../../services/bookingService';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await bookingService.getBookingById(id);
                setBooking(res.data?.data || res.data);
            } catch (err) {
                setError('Không thể lấy thông tin thanh toán.');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);


    const handleConfirmPayment = async () => {
        setProcessing(true);
        setError('');
        try {
            await bookingService.confirmPayment(id);
            setSuccess(true);
            setTimeout(() => {
                navigate('/user/bookings');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    }

    if (error || !booking) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger">{error || 'Đơn đặt sân không tồn tại'}</Alert>
                <Button variant="primary" as={Link} to="/user/bookings">Về danh sách</Button>
            </Container>
        );
    }

    if (success) {
        return (
            <Container className="py-5 text-center" style={{ maxWidth: '600px' }}>
                <div className="mb-4">
                    <BiCheckCircle size={80} className="text-success" />
                </div>
                <h3 className="fw-bold mb-3">Đã gửi yêu cầu thanh toán!</h3>
                <p className="text-muted mb-4">Hệ thống đang xử lý và sẽ cập nhật trạng thái đơn đặt sân của bạn trong ít phút. Đang tự động chuyển về trang lịch sử...</p>
                <Button variant="primary" onClick={() => navigate('/user/bookings')}>Về lịch sử giao dịch</Button>
            </Container>
        );
    }

    const price = booking.total_price || 0;
    // Generate a generic VietQR string for demo purposes, 
    // Format usually involves bank bin, account, amount, description
    const transferFormat = `DOANH THU DAT SAN #${booking.id}`;
    
    // Generate a quick QR from an open API for UI demo (QR of arbitrary text)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ChuyenKhoan-${booking.id}-${price}`;

    return (
        <Container className="py-4 max-w-700" style={{ maxWidth: '800px' }}>
            <div className="d-flex align-items-center mb-4">
                <Button variant="light" onClick={() => navigate(-1)} className="me-3">← Quay lại</Button>
                <h3 className="mb-0 fw-bold"><BiCreditCard className="me-2 text-primary"/>Thanh toán Đơn #{booking.id}</h3>
            </div>

            <Row>
                <Col md={7}>
                    <Card className="border-0 shadow-sm mb-4 h-100">
                        <Card.Header className="bg-white py-3 fw-bold">Thông tin chuyển khoản</Card.Header>
                        <Card.Body className="p-4 text-center">
                            <div className="mb-4">
                                <img src={qrUrl} alt="QR Code" className="img-fluid border p-2 rounded" style={{ width: '200px' }} />
                                <div className="mt-2 small text-muted">Quét mã QR bằng ứng dụng ngân hàng</div>
                            </div>
                            
                            <div className="text-start bg-light p-3 rounded">
                                <Row className="mb-2">
                                    <Col xs={5} className="text-muted small">Ngân hàng thụ hưởng:</Col>
                                    <Col xs={7} className="fw-bold">Vietcombank</Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col xs={5} className="text-muted small">Số tài khoản:</Col>
                                    <Col xs={7} className="fw-bold text-primary">1234567890</Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col xs={5} className="text-muted small">Tên người nhận:</Col>
                                    <Col xs={7} className="fw-bold">CTY TNHH BADMINTON PRO</Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col xs={5} className="text-muted small">Số tiền:</Col>
                                    <Col xs={7} className="fw-bold fs-5 text-danger">{formatPrice(price)}</Col>
                                </Row>
                                <Row>
                                    <Col xs={5} className="text-muted small">Nội dung CK:</Col>
                                    <Col xs={7} className="fw-bold text-success">{transferFormat}</Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={5}>
                    <Card className="border-0 shadow-sm h-100 bg-primary text-white">
                        <Card.Body className="p-4 d-flex flex-column justify-content-center">
                            <h4 className="fw-bold mb-4">Xác nhận chuyển khoản</h4>
                            <p className="mb-4 opacity-75">
                                Sau khi thực hiện chuyển khoản thành công theo đúng nội dung và số tiền yêu cầu, vui lòng nhấn nút "Đã chuyển khoản" để hệ thống tự động đối soát.
                            </p>
                            
                            <Button 
                                variant="light" 
                                size="lg" 
                                className="w-100 fw-bold text-primary shadow-sm"
                                onClick={handleConfirmPayment}
                                disabled={processing}
                            >
                                {processing ? (
                                    <><Spinner size="sm" className="me-2"/> Đang xử lý...</>
                                ) : (
                                    <><BiTransfer className="me-2"/> Đã chuyển khoản</>
                                )}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default Payment;
