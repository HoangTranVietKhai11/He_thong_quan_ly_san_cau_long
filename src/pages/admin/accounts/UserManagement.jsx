import React from 'react';
import { Container, Card, Table, Button, Badge, InputGroup, Form, Row, Col } from 'react-bootstrap';
import { BiSearch, BiUser, BiPlus } from 'react-icons/bi';

// Simple mock data since we're rapidly building
const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'user1@example.com', phone: '0901234567', role: 'customer', status: 'active', registered: '2026-01-15' },
    { id: 2, name: 'Trần Thị B', email: 'user2@example.com', phone: '0907654321', role: 'customer', status: 'active', registered: '2026-01-20' },
    { id: 3, name: 'Lê Văn C', email: 'user3@example.com', phone: '0912345678', role: 'vip', status: 'active', registered: '2025-12-10' }
];

const UserManagement = () => {
    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Quản lý người dùng</h2>
                    <p className="text-muted">Quản lý tài khoản khách hàng</p>
                </div>
                <Button variant="primary">
                    <BiPlus className="me-2" />
                    Thêm người dùng
                </Button>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiUser size={40} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng người dùng</div>
                            <h3 className="fw-bold mb-0">{mockUsers.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Hoạt động</div>
                            <h3 className="fw-bold mb-0 text-success">
                                {mockUsers.filter(u => u.status === 'active').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">VIP</div>
                            <h3 className="fw-bold mb-0 text-warning">
                                {mockUsers.filter(u => u.role === 'vip').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text><BiSearch /></InputGroup.Text>
                        <Form.Control placeholder="Tìm theo tên, email, SĐT" />
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>SĐT</th>
                                    <th>Loại TK</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày đăng ký</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="align-middle">{user.id}</td>
                                        <td className="align-middle"><strong>{user.name}</strong></td>
                                        <td className="align-middle">{user.email}</td>
                                        <td className="align-middle">{user.phone}</td>
                                        <td className="align-middle">
                                            <Badge bg={user.role === 'vip' ? 'warning' : 'info'}>
                                                {user.role === 'vip' ? 'VIP' : 'Thường'}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg="success">Hoạt động</Badge>
                                        </td>
                                        <td className="align-middle">{new Date(user.registered).toLocaleDateString('vi-VN')}</td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="outline-primary">Chi tiết</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserManagement;
