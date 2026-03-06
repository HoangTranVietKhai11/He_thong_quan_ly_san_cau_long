import React from 'react';
import { Container, Card } from 'react-bootstrap';

const TransactionErrors = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Xử lý lỗi giao dịch</h2>
                <p className="text-muted">Theo dõi và khắc phục lỗi thanh toán</p>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Quản lý lỗi giao dịch sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TransactionErrors;
