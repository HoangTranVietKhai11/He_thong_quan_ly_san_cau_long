import React, { useState } from 'react';
import { Container, Card, ListGroup, Badge, Nav } from 'react-bootstrap';
import { BiCheckCircle, BiInfoCircle, BiError, BiTime } from 'react-icons/bi';
import { mockNotifications } from '../../utils/mockData';

const Notifications = () => {
    const [filter, setFilter] = useState('all');

    const filteredNotifications = filter === 'all'
        ? mockNotifications
        : filter === 'unread'
            ? mockNotifications.filter(n => !n.read)
            : mockNotifications.filter(n => n.read);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <BiCheckCircle className="text-success" size={24} />;
            case 'info':
                return <BiInfoCircle className="text-primary" size={24} />;
            case 'warning':
                return <BiError className="text-warning" size={24} />;
            default:
                return <BiInfoCircle className="text-info" size={24} />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Thông báo</h2>
                <Badge bg="primary">{mockNotifications.filter(n => !n.read).length} mới</Badge>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Nav variant="pills">
                        <Nav.Item>
                            <Nav.Link
                                active={filter === 'all'}
                                onClick={() => setFilter('all')}
                            >
                                Tất cả ({mockNotifications.length})
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={filter === 'unread'}
                                onClick={() => setFilter('unread')}
                            >
                                Chưa đọc ({mockNotifications.filter(n => !n.read).length})
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                active={filter === 'read'}
                                onClick={() => setFilter('read')}
                            >
                                Đã đọc ({mockNotifications.filter(n => n.read).length})
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>

            {filteredNotifications.length > 0 ? (
                <Card className="border-0 shadow-sm">
                    <ListGroup variant="flush">
                        {filteredNotifications.map(notification => (
                            <ListGroup.Item
                                key={notification.id}
                                className={`${!notification.read ? 'bg-light' : ''}`}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h6 className="mb-1 fw-bold">
                                                {notification.title}
                                                {!notification.read && (
                                                    <Badge bg="primary" className="ms-2" style={{ fontSize: '10px' }}>
                                                        MỚI
                                                    </Badge>
                                                )}
                                            </h6>
                                            <small className="text-muted">
                                                <BiTime className="me-1" />
                                                {formatTime(notification.createdAt)}
                                            </small>
                                        </div>
                                        <p className="mb-0 text-muted">{notification.message}</p>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5">
                        <BiInfoCircle size={60} className="text-muted mb-3" />
                        <h5 className="text-muted">Không có thông báo nào</h5>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Notifications;
