import React from 'react';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import { BiPlus } from 'react-icons/bi';
import { mockUsers } from '../../utils/mockData';

const Users = () => {
    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý người dùng</h2>
                <Button variant="primary">
                    <BiPlus size={20} className="me-2" />
                    Thêm người dùng
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số ĐT</th>
                                <th>Vai trò</th>
                                <th>Ngày tham gia</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="rounded-circle me-2"
                                                width="32"
                                                height="32"
                                            />
                                            <strong>{user.name}</strong>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <Badge bg={
                                            user.role === 'admin' ? 'danger' :
                                                user.role === 'owner' ? 'warning' : 'primary'
                                        } className="text-capitalize">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                                            {user.status === 'active' ? 'Hoạt động' : 'Khóa'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm">Sửa</Button>
                                            <Button variant="outline-danger" size="sm">Khóa</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Users;
