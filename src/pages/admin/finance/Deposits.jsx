import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { BiDollar, BiCalendar, BiCheck, BiX } from 'react-icons/bi';
import adminFinanceService from '../../../services/adminFinanceService';

const Deposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const res = await adminFinanceService.getDeposits();
            setDeposits(res.data?.data || res.data || []);
        } catch (err) {
            setError('Lỗi tải danh sách cọc: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const variants = {
            Pending: 'warning',
            Success: 'success',
            Failed: 'danger',
            active: 'warning',
            completed: 'success',
            expired: 'danger',
            refunded: 'secondary'
        };
        const labels = {
            Pending: 'Đang chờ',
            Success: 'Hoàn thành',
            Failed: 'Vấn đề',
            active: 'Đang chờ',
            completed: 'Hoàn thành',
            expired: 'Hết hạn',
            refunded: 'Đã hoàn'
        };
        const s = status || 'active';
        return <Badge bg={variants[s]}>{labels[s]}</Badge>;
    };

    const totalDeposits = deposits.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const activeCount = deposits.filter(d => d.status === 'Pending' || d.status === 'active').length;
    const completedCount = deposits.filter(d => d.status === 'Success' || d.status === 'completed').length;
    
    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Theo dõi cọc</h2>
                <p className="text-muted">Quản lý các giao dịch Deposit tiền cọc đặt sân</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

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
                            <div className="text-muted small">Lỗi / Hết hạn</div>
                            <h3 className="fw-bold mb-0 text-danger">
                                {deposits.filter(d => d.status === 'Failed' || d.status === 'expired').length}
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
                                    <th>Mã GD Cọc</th>
                                    <th>Booking ID</th>
                                    <th>Khách hàng</th>
                                    <th>Số tiền cọc</th>
                                    <th>Ngày cọc</th>
                                    <th>PT thanh toán</th>
                                    <th>Trạng thái GD</th>
                                    <th>Trạng thái Booking</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deposits.map((deposit) => (
                                    <tr key={deposit.id}>
                                        <td className="align-middle"><strong>#{deposit.id}</strong></td>
                                        <td className="align-middle">#{deposit.booking_id || 'N/A'}</td>
                                        <td className="align-middle">
                                            <div>{deposit.full_name}</div>
                                            <small className="text-muted">{deposit.phone}</small>
                                        </td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(deposit.amount)}</strong>
                                        </td>
                                        <td className="align-middle">{formatDate(deposit.created_at)}</td>
                                        <td className="align-middle">
                                            <Badge bg="secondary">
                                                {deposit.payment_method === 'Cash' ? 'Tiền mặt' : 
                                                 deposit.payment_method === 'Transfer' ? 'Chuyển khoản' : 
                                                 deposit.payment_method}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">{getStatusBadge(deposit.status)}</td>
                                        <td className="align-middle">
                                            <Badge bg={deposit.booking_status === 'Pending' ? 'warning' : 'info'}>
                                                {deposit.booking_status || 'N/A'}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="outline-primary">Chi tiết</Button>
                                        </td>
                                    </tr>
                                ))}
                                {deposits.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4 text-muted">Không có dữ liệu cọc</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Deposits;
