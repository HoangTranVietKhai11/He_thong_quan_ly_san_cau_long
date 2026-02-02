import React from 'react';
import { Container, Card } from 'react-bootstrap';

const CounterPayment = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Thu tiền tại quầy</h2>
                <p className="text-muted">Thanh toán qua tiền mặt hoặc thẻ tại quầy</p>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Giao diện thanh toán tại quầy sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CounterPayment;
