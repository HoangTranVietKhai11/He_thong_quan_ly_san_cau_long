import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { BiPlus, BiGift, BiEdit, BiTrash, BiCheckCircle } from 'react-icons/bi';
import voucherService from '../../../services/voucherService';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        code: '',
        name: '',
        discount_type: 'percent',
        value: 0,
        min_order: 0,
        max_uses: 100,
        expiry_date: ''
    });

    const loadVouchers = async () => {
        try {
            setLoading(true);
            const res = await voucherService.getAllVouchers();
            setVouchers(res.data || []);
        } catch (err) {
            setError('Không thể tải danh sách voucher: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadVouchers(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await voucherService.createVoucher({
                ...newVoucher,
                name: newVoucher.name || `Giảm giá ${newVoucher.code}`
            });
            setSuccess('Tạo voucher thành công!');
            setShowAddModal(false);
            loadVouchers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Lỗi tạo voucher: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
        try {
            await voucherService.deleteVoucher(id);
            setSuccess('Xóa voucher thành công!');
            loadVouchers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Lỗi xóa voucher: ' + (err.response?.data?.message || err.message));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Vĩnh viễn';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter(v => v.status === 'Active').length;
    const totalUsed = vouchers.reduce((sum, v) => sum + (v.used_count || 0), 0);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Quản lý Voucher</h2>
                    <p className="text-muted">Tạo và quản lý các chương trình khuyến mãi mã giảm giá</p>
                </div>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <BiPlus className="me-2" /> Tạo voucher mới
                </Button>
            </div>

            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            {/* Statistics */}
            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng Vouchers', value: totalVouchers, icon: <BiGift />, color: 'primary' },
                    { label: 'Đang hoạt động', value: activeVouchers, icon: null, color: 'success' },
                    { label: 'Lượt sử dụng', value: totalUsed, icon: null, color: 'info' },
                    { label: 'Vượt hạn mức', value: vouchers.filter(v => v.used_count >= v.max_uses).length, icon: null, color: 'danger' }
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center">
                                {s.icon && <div className={`text-${s.color} mb-2`} style={{ fontSize: '2rem' }}>{s.icon}</div>}
                                <div className="text-muted small">{s.label}</div>
                                <h3 className={`fw-bold mb-0 text-${s.color}`}>{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Vouchers Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã</th>
                                    <th>Loại</th>
                                    <th>Giá trị</th>
                                    <th>Đơn tối thiểu</th>
                                    <th>Tình trạng (Lượt dùng)</th>
                                    <th>Hạn dùng</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map((voucher) => {
                                    const usagePercent = Math.min(((voucher.used_count || 0) / voucher.max_uses) * 100, 100);
                                    return (
                                        <tr key={voucher.id}>
                                            <td className="align-middle">
                                                <Badge bg="dark" className="p-2 px-3 fs-6">{voucher.code}</Badge>
                                            </td>
                                            <td className="align-middle">
                                                <Badge bg={voucher.discount_type === 'percent' ? 'info' : 'warning'}>
                                                    {voucher.discount_type === 'percent' ? 'Phần trăm' : 'Cố định'}
                                                </Badge>
                                            </td>
                                            <td className="align-middle fw-bold text-primary">
                                                {voucher.discount_type === 'percent' ? `${voucher.value}%` : formatPrice(voucher.value)}
                                            </td>
                                            <td className="align-middle">{formatPrice(voucher.min_order)}</td>
                                            <td className="align-middle" style={{ minWidth: '150px' }}>
                                                <div className="small mb-1">{voucher.used_count || 0}/{voucher.max_uses}</div>
                                                <ProgressBar
                                                    now={usagePercent}
                                                    variant={usagePercent > 90 ? 'danger' : usagePercent > 70 ? 'warning' : 'success'}
                                                    style={{ height: '6px' }}
                                                />
                                            </td>
                                            <td className="align-middle small">
                                                {formatDate(voucher.expiry_date)}
                                            </td>
                                            <td className="align-middle">
                                                <Badge bg={voucher.status === 'Active' ? 'success' : 'secondary'}>
                                                    {voucher.status === 'Active' ? 'Hoạt động' : 'Tạm dừng'}
                                                </Badge>
                                            </td>
                                            <td className="align-middle">
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(voucher.id)}>
                                                    <BiTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {vouchers.length === 0 && <tr><td colSpan="8" className="text-center py-5 text-muted">Chưa có voucher nào.</td></tr>}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Add Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton className="fw-bold">Tạo Voucher mới</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã Voucher (Code)</Form.Label>
                                    <Form.Control 
                                        placeholder="VD: KM50" 
                                        required 
                                        value={newVoucher.code} 
                                        onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại</Form.Label>
                                    <Form.Select value={newVoucher.discount_type} onChange={e => setNewVoucher({...newVoucher, discount_type: e.target.value})}>
                                        <option value="percent">Phần trăm (%)</option>
                                        <option value="fixed">Cố định (đ)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá trị giảm</Form.Label>
                            <Form.Control type="number" required value={newVoucher.value} onChange={e => setNewVoucher({...newVoucher, value: +e.target.value})} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Áp dụng từ (Min Order)</Form.Label>
                                    <Form.Control type="number" value={newVoucher.min_order} onChange={e => setNewVoucher({...newVoucher, min_order: +e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lượt dùng tối đa</Form.Label>
                                    <Form.Control type="number" value={newVoucher.max_uses} onChange={e => setNewVoucher({...newVoucher, max_uses: +e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label>Ngày hết hạn</Form.Label>
                            <Form.Control type="date" value={newVoucher.expiry_date} onChange={e => setNewVoucher({...newVoucher, expiry_date: e.target.value})} />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100 py-2">
                            <BiCheckCircle className="me-2" /> Xác nhận tạo
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Vouchers;
