import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { BiSearch, BiFilter, BiReceipt } from 'react-icons/bi';

const mockTransactions = [
    { id: 'TXN1001', date: '2026-03-13T10:15:00', amount: 240000, method: 'Credit Card', status: 'success', description: 'Thanh toán đặt sân 1 (15/03/2026)' },
    { id: 'TXN1002', date: '2026-03-10T14:30:00', amount: 150000, method: 'MoMo', status: 'success', description: 'Thanh toán đặt sân 3 (12/03/2026)' },
    { id: 'TXN1003', date: '2026-03-05T09:45:00', amount: 300000, method: 'MoMo', status: 'failed', description: 'Thanh toán đặt sân 2 (06/03/2026)' },
    { id: 'TXN1004', date: '2026-03-01T18:20:00', amount: 120000, method: 'Counter', status: 'pending', description: 'Thanh toán tại quầy sân 4 (02/03/2026)' },
];

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'success': return <Badge bg="success" className="px-3 py-2 rounded-pill">Thành công</Badge>;
            case 'failed': return <Badge bg="danger" className="px-3 py-2 rounded-pill">Thất bại</Badge>;
            case 'pending': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Chờ xử lý</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    // Filtering logic
    const filteredTransactions = transactions.filter(t => {
        const matchStatus = filterStatus === 'all' || t.status === filterStatus;
        const matchSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Lịch sử giao dịch</h2>
                    <p className="text-muted">Theo dõi và quản lý các hóa đơn thanh toán của bạn</p>
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={6} lg={4}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white"><BiSearch className="text-muted"/></InputGroup.Text>
                                <Form.Control 
                                    placeholder="Tìm mã giao dịch, mô tả..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6} lg={3}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white"><BiFilter className="text-muted"/></InputGroup.Text>
                                <Form.Select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="success">Thành công</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="failed">Thất bại</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 px-4">Mã GD</th>
                                    <th className="py-3">Thời gian</th>
                                    <th className="py-3">Nội dung</th>
                                    <th className="py-3">Phương thức</th>
                                    <th className="py-3">Số tiền</th>
                                    <th className="py-3">Trạng thái</th>
                                    <th className="py-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((t) => (
                                        <tr key={t.id}>
                                            <td className="px-4 fw-bold text-primary">{t.id}</td>
                                            <td className="text-muted">{formatDate(t.date)}</td>
                                            <td>{t.description}</td>
                                            <td>{t.method}</td>
                                            <td className="fw-bold">{formatPrice(t.amount)}</td>
                                            <td>{getStatusBadge(t.status)}</td>
                                            <td className="text-center">
                                                <Button variant="link" size="sm" className="text-decoration-none">
                                                    <BiReceipt className="me-1" /> Chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            Không tìm thấy giao dịch nào.
                                        </td>
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

export default TransactionHistory;
