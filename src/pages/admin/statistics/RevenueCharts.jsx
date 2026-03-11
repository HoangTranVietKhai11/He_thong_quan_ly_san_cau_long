import React from 'react';
import { Container, Card } from 'react-bootstrap';

const RevenueCharts = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Biểu đồ doanh thu</h2>
                <p className="text-muted">Trực quan hóa doanh thu theo thời gian</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Biểu đồ doanh thu sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RevenueCharts;
