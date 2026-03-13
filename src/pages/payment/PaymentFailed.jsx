import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { BiXCircle, BiRefresh, BiHomeAlt } from 'react-icons/bi';

const PaymentFailed = () => {
    return (
        <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="shadow-lg border-0 text-center" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
                <Card.Body className="p-5">
                    <BiXCircle size={80} className="text-danger mb-3" />
                    <h2 className="fw-bold mb-2">Thanh toán thất bại</h2>
                    <p className="text-muted mb-4">
                        Rất tiếc, giao dịch của bạn không thể hoàn tất do lỗi kết nối hoặc tài khoản không đủ số dư. Vui lòng thử lại.
                    </p>

                    <div className="d-grid gap-3">
                        <Button variant="primary" size="lg" className="rounded-pill shadow-sm">
                            <BiRefresh className="me-2" /> Thử thanh toán lại
                        </Button>
                        <Button variant="light" size="lg" className="rounded-pill border">
                            <BiHomeAlt className="me-2" /> Về trang chủ
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentFailed;
