import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import adminFinanceService from '../../../services/adminFinanceService';

const TransactionErrors = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await adminFinanceService.getAllTransactions();
            setTransactions(res.data?.data || res.data || []);
        } catch (err) {
            setError('Lỗi tải danh sách giao dịch: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const variants = {
            Success: 'success',
            Failed: 'danger',
            Pending: 'warning'
        };
        const labels = {
            Success: 'Thành công',
            Failed: 'Thất bại (Lỗi)',
            Pending: 'Chờ xử lý'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    const getTypeBadge = (type) => {
        const variants = {
            Deposit: 'primary',
            Payment: 'info',
            Refund: 'secondary',
            TopUp: 'success',
            Overtime: 'warning'
        };
        return <Badge bg={variants[type] || 'dark'}>{type}</Badge>;
    };

    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Giao dịch Hệ thống (Bao gồm lỗi)</h2>
                <p className="text-muted">Theo dõi và kiểm tra toàn bộ hoạt động thanh toán, nạp tiền, hoàn tiền.</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã GD</th>
                                    <th>Thời gian</th>
                                    <th>Khách hàng</th>
                                    <th>Loại GD</th>
                                    <th>Số tiền</th>
                                    <th>PT Thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="align-middle"><strong>#{tx.id}</strong></td>
                                        <td className="align-middle text-muted">{formatDate(tx.created_at)}</td>
                                        <td className="align-middle">
                                            <div>{tx.full_name}</div>
                                            <small className="text-muted">{tx.email}</small>
                                        </td>
                                        <td className="align-middle">{getTypeBadge(tx.type)}</td>
                                        <td className="align-middle">
                                            <strong className={tx.type === 'Refund' || tx.type === 'TopUp' ? 'text-success' : 'text-primary'}>
                                                {formatPrice(tx.amount)}
                                            </strong>
                                        </td>
                                        <td className="align-middle">{tx.payment_method}</td>
                                        <td className="align-middle">{getStatusBadge(tx.status)}</td>
                                        <td className="align-middle">
                                            <small className="text-muted">{tx.description || 'Không có mô tả'}</small>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">Không có dữ liệu giao dịch</td>
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

export default TransactionErrors;
