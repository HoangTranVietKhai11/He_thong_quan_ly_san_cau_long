import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import { BiDollar, BiCalendar, BiCheck, BiX } from 'react-icons/bi';
import { mockDeposits } from '../../../utils/mockAdminData';

const Deposits = () => {
    const [deposits, setDeposits] = useState(mockDeposits);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const variants = {
            active: 'warning',
            completed: 'success',
            expired: 'danger',
            refunded: 'secondary'
        };
        const labels = {
            active: 'Đang chờ',
            completed: 'Hoàn thành',
            expired: 'Hết hạn',
            refunded: 'Đã hoàn'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
    const activeCount = deposits.filter(d => d.status === 'active').length;
    const completedCount = deposits.filter(d => d.status === 'completed').length;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Theo dõi cọc</h2>
                <p className="text-muted">Quản lý tiền cọc đặt sân</p>
            </div>

            {/* Statistics */}
            < Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiDollar size={40} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng cọc</div>
                            <h4 className="fw-bold mb-0 text-primary">{formatPrice(totalDeposits)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCalendar size={40} className="text-warning mb-2" />
                            <div className="text-muted small">Đang chờ</div>
                            <h3 className="fw-bold mb-0 text-warning">{activeCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCheck size={40} className="text-success mb-2" />
                            <div className="text-muted small">Hoàn thành</div>
                            <h3 className="fw-bold mb-0 text-success">{completedCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiX size={40} className="text-danger mb-2" />
                            <div className="text-muted small">Hết hạn</div>
                            <h3 className="fw-bold mb-0 text-danger">
                                {deposits.filter(d => d.status === 'expired').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Deposits Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã cọc</th>
                                    <th>Mã booking</th>
                                    <th>Khách hàng</th>
                                    <th>Số tiền cọc</th>
                                    <th>Tổng giá trị</th>
                                    <th>Ngày cọc</th>
                                    <th>Hạn thanh toán</th>
                                    <th>PT thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit) => (
                                    <tr key={deposit.id}>
                                        <td className="align-middle"><strong>{deposit.id}</strong></td>
                                        <td className="align-middle">{deposit.bookingId}</td>
                                        <td className="align-middle">{deposit.userName}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(deposit.amount)}</strong>
                                        </td>
                                        <td className="align-middle">{formatPrice(deposit.totalPrice)}</td>
                                        <td className="align-middle">{formatDate(deposit.depositDate)}</td>
                                        <td className="align-middle">{formatDate(deposit.dueDate)}</td>
                                        <td className="align-middle">
                                            <Badge bg="secondary">
                                                {deposit.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">{getStatusBadge(deposit.status)}</td>
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

export default Deposits;
