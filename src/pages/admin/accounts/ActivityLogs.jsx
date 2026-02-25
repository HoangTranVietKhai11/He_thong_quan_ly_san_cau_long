import React from 'react';
import { Container, Card } from 'react-bootstrap';

const ActivityLogs = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Lịch sử hoạt động</h2>
                <p className="text-muted">Theo dõi log hoạt động hệ thống</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ActivityLogs;
