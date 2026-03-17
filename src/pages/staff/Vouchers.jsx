import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FiTag, FiPlus, FiEdit, FiToggleLeft, FiToggleRight, FiPercent, FiDollarSign } from 'react-icons/fi';
import voucherService from '../../services/voucherService';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [formData, setFormData] = useState({
        code: '', discount_type: 'percent', value: '', min_order: '', max_uses: '', expiry_date: ''
    });

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const res = await voucherService.getAllVouchers();
            setVouchers(res.data || []);
        } catch (e) {
            setError('Không thể tải danh sách voucher: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const resetForm = () => setFormData({ code: '', discount_type: 'percent', value: '', min_order: '', max_uses: '', expiry_date: '' });

    const handleCreate = async () => {
        try {
            await voucherService.createVoucher({
                code: formData.code, discount_type: formData.discount_type,
                value: parseFloat(formData.value), min_order: parseFloat(formData.min_order || 0),
                max_uses: parseInt(formData.max_uses || 100), expiry_date: formData.expiry_date || null
            });
            setSuccessMsg('Tạo voucher thành công!');
            setShowCreateModal(false); resetForm(); fetchVouchers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (e) {
            setError('Lỗi: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleEdit = (voucher) => {
        setSelectedVoucher(voucher);
        setFormData({
            code: voucher.code, discount_type: voucher.discount_type,
            value: String(voucher.value || ''), min_order: String(voucher.min_order || ''),
            max_uses: String(voucher.max_uses || ''), expiry_date: voucher.expiry_date?.split('T')[0] || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await voucherService.updateVoucher(selectedVoucher.id, {
                discount_type: formData.discount_type, value: parseFloat(formData.value),
                min_order: parseFloat(formData.min_order || 0), expiry_date: formData.expiry_date || null
            });
            setSuccessMsg('Cập nhật thành công!');
            setShowEditModal(false); fetchVouchers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (e) {
            setError('Lỗi: ' + (e.response?.data?.message || e.message));
        }
    };

    const toggleVoucherStatus = async (voucher) => {
        try {
            const newStatus = voucher.status === 'Active' ? 'Inactive' : 'Active';
            await voucherService.updateVoucher(voucher.id, { status: newStatus });
            fetchVouchers();
        } catch (e) {
            setError('Lỗi: ' + (e.response?.data?.message || e.message));
        }
    };

    const activeVouchers = vouchers.filter(v => v.status === 'Active');
    const inactiveVouchers = vouchers.filter(v => v.status !== 'Active');

    const renderVoucherCard = (voucher) => {
        const isActive = voucher.status === 'Active';
        const usagePercent = voucher.max_uses > 0 ? Math.min((voucher.used_count / voucher.max_uses) * 100, 100) : 0;
        return (
            <Col lg={6} xl={4} key={voucher.id} className="mb-4">
                <Card className={`h-100 ${isActive ? '' : 'opacity-75'}`}>
                    <div className="p-3" style={{
                        background: isActive ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                        borderBottom: `3px solid ${isActive ? '#f59e0b' : '#9ca3af'}`
                    }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge bg={isActive ? 'warning' : 'secondary'} text="dark" style={{ fontSize: '14px' }}>{voucher.code}</Badge>
                            <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Hoạt động' : 'Tắt'}</Badge>
                        </div>
                        <h3 className="mb-0 text-dark">
                            {voucher.discount_type === 'percent' ? <><FiPercent className="me-1" size={28} />{voucher.value}%</> : <><FiDollarSign className="me-1" size={28} />{(voucher.value / 1000).toFixed(0)}K</>}
                        </h3>
                        <small className="text-dark opacity-75">Giảm giá</small>
                    </div>
                    <Card.Body>
                        <div className="small mb-3">
                            <div className="mb-1"><strong>Đơn tối thiểu:</strong> {(voucher.min_order || 0).toLocaleString('vi-VN')} ₫</div>
                            {voucher.expiry_date && <div><strong>Hết hạn:</strong> {new Date(voucher.expiry_date).toLocaleDateString('vi-VN')}</div>}
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                                <span>Đã dùng</span><span>{voucher.used_count} / {voucher.max_uses}</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${usagePercent}%` }} />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleEdit(voucher)}><FiEdit className="me-1" />Sửa</Button>
                            <Button variant={isActive ? 'outline-secondary' : 'outline-success'} size="sm" className="flex-grow-1" onClick={() => toggleVoucherStatus(voucher)}>
                                {isActive ? <><FiToggleRight className="me-1" />Tắt</> : <><FiToggleLeft className="me-1" />Bật</>}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    const VoucherForm = () => (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mã voucher *</Form.Label>
                        <Form.Control placeholder="VD: WELCOME10" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Loại giảm giá *</Form.Label>
                        <Form.Select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value })}>
                            <option value="percent">Phần trăm (%)</option>
                            <option value="fixed">Số tiền cố định (₫)</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá trị *</Form.Label>
                        <InputGroup>
                            <Form.Control type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                            <InputGroup.Text>{formData.discount_type === 'percent' ? '%' : '₫'}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Đơn tối thiểu (₫)</Form.Label>
                        <Form.Control type="number" value={formData.min_order} onChange={e => setFormData({ ...formData, min_order: e.target.value })} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giới hạn sử dụng</Form.Label>
                        <Form.Control type="number" value={formData.max_uses} onChange={e => setFormData({ ...formData, max_uses: e.target.value })} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Ngày hết hạn</Form.Label>
                <Form.Control type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
            </Form.Group>
        </Form>
    );

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1"><FiTag className="me-2 text-warning" />Quản Lý Voucher</h3>
                    <p className="text-muted mb-0">Tạo và quản lý voucher giảm giá</p>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowCreateModal(true); }}>
                    <FiPlus className="me-2" />Tạo Voucher Mới
                </Button>
            </div>

            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Row className="mb-4">
                {[
                    { label: 'Đang hoạt động', value: activeVouchers.length, color: 'text-success' },
                    { label: 'Không hoạt động', value: inactiveVouchers.length, color: 'text-secondary' },
                    { label: 'Tổng lượt dùng', value: vouchers.reduce((s, v) => s + (v.used_count || 0), 0), color: 'text-warning' },
                ].map((s, i) => (
                    <Col md={4} key={i}><Card className="border-0 shadow-sm"><Card.Body className="text-center"><h4 className={`${s.color} mb-1`}>{s.value}</h4><div className="small text-muted">{s.label}</div></Card.Body></Card></Col>
                ))}
            </Row>

            {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
                <>
                    {activeVouchers.length > 0 && (
                        <div className="mb-5">
                            <h5 className="mb-3"><Badge bg="success" className="me-2">{activeVouchers.length}</Badge>Voucher Hoạt Động</h5>
                            <Row>{activeVouchers.map(renderVoucherCard)}</Row>
                        </div>
                    )}
                    {inactiveVouchers.length > 0 && (
                        <div>
                            <h5 className="mb-3"><Badge bg="secondary" className="me-2">{inactiveVouchers.length}</Badge>Voucher Không Hoạt Động</h5>
                            <Row>{inactiveVouchers.map(renderVoucherCard)}</Row>
                        </div>
                    )}
                    {vouchers.length === 0 && (
                        <div className="text-center py-5 text-muted"><FiTag size={48} className="mb-3 opacity-25" /><p>Chưa có voucher nào. Hãy tạo voucher đầu tiên!</p></div>
                    )}
                </>
            )}

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title><FiPlus className="me-2" />Tạo Voucher Mới</Modal.Title></Modal.Header>
                <Modal.Body><VoucherForm /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleCreate}><FiPlus className="me-2" />Tạo Voucher</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title><FiEdit className="me-2" />Chỉnh Sửa Voucher: {selectedVoucher?.code}</Modal.Title></Modal.Header>
                <Modal.Body><VoucherForm /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSaveEdit}><FiEdit className="me-2" />Lưu</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Vouchers;
