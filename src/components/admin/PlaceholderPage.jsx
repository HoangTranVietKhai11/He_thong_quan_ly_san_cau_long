import React from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { BiWrench } from 'react-icons/bi';

const PlaceholderPage = ({ title, description, module }) => {
    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">{title}</h2>
                <p className="text-muted">{description}</p>
            </div>

            <Alert variant="info" className="d-flex align-items-center">
                <BiWrench size={24} className="me-3" />
                <div>
                    <strong>Đang phát triển</strong>
                    <p className="mb-0 mt-1">Tính năng này đang được xây dựng. Module: {module}</p>
                </div>
            </Alert>

            <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                    <BiWrench size={80} className="text-muted mb-3" />
                    <h4 className="text-muted">Chức năng sẽ sớm ra mắt</h4>
                    <p className="text-muted">Trang này đang trong quá trình phát triển</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PlaceholderPage;
