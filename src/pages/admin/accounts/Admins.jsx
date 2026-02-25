import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Admins = () => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Quản trị viên</h2>
                <p className="text-muted">Quản lý tài khoản quản trị viên</p>
            </div>
            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <h5 className="text-muted">Tín năng đang phát triển</h5>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Admins;
