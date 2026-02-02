import React from 'react';
import { Container, Card } from 'react-bootstrap';

const BookingStats = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Thống kê đặt sân</h2>
                <p className="text-muted">Phân tích số liệu đặt sân</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Biểu đồ thống kê và phân tích sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingStats;
