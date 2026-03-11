import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { BiSearch, BiDollar } from 'react-icons/bi';
import { mockWallets } from '../../../utils/mockAdminData';

const Wallets = () => {
    const [wallets, setWallets] = useState(mockWallets);
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const filteredWallets = searchTerm
        ? wallets.filter(w => w.userName.toLowerCase().includes(searchTerm.toLowerCase()) || w.userPhone.includes(searchTerm))
        : wallets;

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const totalDeposit = wallets.reduce((sum, w) => sum + w.totalDeposit, 0);
    const totalSpent = wallets.reduce((sum, w) => sum + w.totalSpent, 0);

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Quản lý ví</h2>
                <p className="text-muted">Theo dõi ví điện tử của khách hàng</p>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiDollar size={40} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng sốdư</div>
                            <h4 className="fw-bold mb-0 text-primary">{formatPrice(totalBalance)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng nạp</div>
                            <h4 className="fw-bold mb-0 text-success">{formatPrice(totalDeposit)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng chi</div>
                            <h4 className="fw-bold mb-0 text-danger">{formatPrice(totalSpent)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text><BiSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm theo tên hoặc SĐT"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Wallets Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Khách hàng</th>
                                    <th>SĐT</th>
                                    <th>Số dư hiện tại</th>
                                    <th>Tổng nạp</th>
                                    <th>Tổng chi</th>
                                    <th>Giao dịch cuối</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWallets.map((wallet) => (
                                    <tr key={wallet.id}>
                                        <td className="align-middle"><strong>{wallet.userName}</strong></td>
                                        <td className="align-middle">{wallet.userPhone}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(wallet.balance)}</strong>
                                        </td>
                                        <td className="align-middle text-success">{formatPrice(wallet.totalDeposit)}</td>
                                        <td className="align-middle text-danger">{formatPrice(wallet.totalSpent)}</td>
                                        <td className="align-middle">
                                            <small>{formatDate(wallet.lastTransaction)}</small>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={wallet.status === 'active' ? 'success' : 'secondary'}>
                                                {wallet.status === 'active' ? 'Hoạt động' : 'Khóa'}
                                            </Badge>
                                        </td>
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

export default Wallets;
