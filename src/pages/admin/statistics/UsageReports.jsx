import React from 'react';
import { Container, Card } from 'react-bootstrap';

const UsageReports = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Báo cáo sử dụng sân</h2>
                <p className="text-muted">Phân tích tỷ lệ sử dụng sân</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                    <p className="text-muted">Báo cáo sử dụng sân sẽ được triển khai sau</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UsageReports;
