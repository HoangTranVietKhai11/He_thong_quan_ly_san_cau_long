import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Roles = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Phân quyền</h2>
                <p className="text-muted">Quản lý vai trò và quyền hạn</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tính năng đang phát triển</h5>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Roles;
