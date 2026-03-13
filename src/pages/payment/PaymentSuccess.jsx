import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { BiCheckCircle, BiCalendar, BiHomeAlt } from 'react-icons/bi';

const PaymentSuccess = () => {
    const bookingId = "BK" + Math.floor(Math.random() * 1000000);

    return (
        <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="shadow-lg border-0 text-center" style={{ maxWidth: '500px', width: '100%', borderRadius: '1rem' }}>
                <Card.Body className="p-5">
                    <BiCheckCircle size={80} className="text-success mb-3" />
                    <h2 className="fw-bold mb-2">Thanh toán thành công!</h2>
                    <p className="text-muted mb-4">Cảm ơn bạn đã tin tưởng. Lịch đặt sân của bạn đã được xác nhận.</p>
                    
                    <div className="bg-light p-3 rounded mb-4 text-start">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Mã đơn hàng:</span>
                            <strong className="text-primary">{bookingId}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Sân:</span>
                            <strong>Sân 1 - Tiêu chuẩn</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Thời gian:</span>
                            <strong>18:00 - 20:00 (15/03/2026)</strong>
                        </div>
                        <div className="d-flex justify-content-between pt-2 border-top">
                            <span className="text-muted">Tổng tiền:</span>
                            <strong className="text-success">240.000 ₫</strong>
                        </div>
                    </div>

                    <div className="d-grid gap-3">
                        <Button variant="primary" size="lg" className="rounded-pill">
                            <BiCalendar className="me-2" /> Xem chi tiết đặt sân
                        </Button>
                        <Button variant="outline-secondary" size="lg" className="rounded-pill">
                            <BiHomeAlt className="me-2" /> Về trang chủ
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentSuccess;
