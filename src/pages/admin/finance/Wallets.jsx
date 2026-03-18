import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, InputGroup, Form, Spinner, Alert, Modal } from 'react-bootstrap';
import { BiSearch, BiDollar, BiPlus } from 'react-icons/bi';
import adminFinanceService from '../../../services/adminFinanceService';

const Wallets = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // TopUp Modal states
    const [showTopUp, setShowTopUp] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [toppingUp, setToppingUp] = useState(false);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const res = await adminFinanceService.getAllWallets();
            setWallets(res.data?.data || res.data || []);
        } catch (err) {
            setError('Lỗi tải danh sách ví: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleShowTopUp = (wallet) => {
        setSelectedUser(wallet);
        setAmount('');
        setDescription('Admin nạp tiền vào ví');
        setShowTopUp(true);
    };

    const handleCloseTopUp = () => {
        setShowTopUp(false);
        setSelectedUser(null);
        setAmount('');
    };

    const handleTopUpSubmit = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return alert('Vui lòng nhập số tiền hợp lệ');
        
        setToppingUp(true);
        try {
            await adminFinanceService.topUpWallet(selectedUser.user_id, amount, description);
            handleCloseTopUp();
            fetchWallets(); // Reload list
        } catch (err) {
            alert('Lỗi nạp tiền: ' + (err.response?.data?.message || err.message));
        } finally {
            setToppingUp(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const filteredWallets = searchTerm
        ? wallets.filter(w => (w.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (w.phone || '').includes(searchTerm) || 
                              (w.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
        : wallets;

    const totalBalance = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0);
    
    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Quản lý ví</h2>
                <p className="text-muted">Theo dõi ví điện tử của khách hàng</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body className="d-flex align-items-center justify-content-between p-4">
                            <div>
                                <div className="text-white-50 mb-1">Tổng Số Dư Toàn Hệ Thống</div>
                                <h2 className="fw-bold mb-0">{formatPrice(totalBalance)}</h2>
                            </div>
                            <BiDollar size={60} className="text-white-50" />
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
                                    <th>SĐT / Email</th>
                                    <th>Số dư hiện tại</th>
                                    <th>Giao dịch cuối</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWallets.map((wallet) => (
                                    <tr key={wallet.id}>
                                        <td className="align-middle"><strong>{wallet.full_name}</strong></td>
                                        <td className="align-middle">
                                            <div>{wallet.phone || 'N/A'}</div>
                                            <small className="text-muted">{wallet.email}</small>
                                        </td>
                                        <td className="align-middle">
                                            <strong className="text-primary fs-5">{formatPrice(wallet.balance)}</strong>
                                        </td>
                                        <td className="align-middle text-muted">
                                            {formatDate(wallet.updated_at)}
                                        </td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="success" onClick={() => handleShowTopUp(wallet)}>
                                                <BiPlus className="me-1" /> Nạp tiền
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredWallets.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">Không tìm thấy ví nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            {/* Modal Nạp Tiền */}
            <Modal show={showTopUp} onHide={handleCloseTopUp} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nạp tiền vào ví</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleTopUpSubmit}>
                    <Modal.Body>
                        <div className="mb-3">
                            Khách hàng: <strong>{selectedUser?.full_name}</strong> <br/>
                            Số dư hiện tại: <strong className="text-primary">{selectedUser ? formatPrice(selectedUser.balance) : 0}</strong>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Số tiền nạp (VNĐ)</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1000"
                                required 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                placeholder="VD: 100000"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung nạp (Tùy chọn)</Form.Label>
                            <Form.Control 
                                type="text"
                                value={description} 
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseTopUp}>Hủy</Button>
                        <Button variant="success" type="submit" disabled={toppingUp}>
                            {toppingUp ? <Spinner size="sm" /> : 'Xác nhận nạp tiền'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Wallets;
