import React from 'react';
import { Container, Card } from 'react-bootstrap';

const OvertimeFees = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Cấu hình phí quá giờ</h2>
                <p className="text-muted">Thiết lập phí phát sinh khi khách sử dụng quá giờ</p>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Cấu hình phí quá giờ sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OvertimeFees;
