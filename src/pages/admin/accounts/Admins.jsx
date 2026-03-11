import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, InputGroup, Alert } from 'react-bootstrap';
import { BiSearch, BiShield, BiPlus, BiEdit, BiTrash, BiLock, BiLockOpen } from 'react-icons/bi';

const mockAdmins = [
    { id: 1, name: 'Trần Minh Quân', email: 'admin1@badminton.vn', phone: '0901111111', status: 'active', lastLogin: '2026-03-03 08:30', createdAt: '2025-01-01' },
    { id: 2, name: 'Nguyễn Thị Lan', email: 'admin2@badminton.vn', phone: '0902222222', status: 'active', lastLogin: '2026-03-02 14:00', createdAt: '2025-03-15' },
    { id: 3, name: 'Lê Văn Dũng', email: 'admin3@badminton.vn', phone: '0903333333', status: 'inactive', lastLogin: '2026-02-20 09:15', createdAt: '2025-06-01' },
];

const Admins = () => {
    const [admins, setAdmins] = useState(mockAdmins);
    const [showModal, setShowModal] = useState(false);
    const [editAdmin, setEditAdmin] = useState(null);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

    const filtered = admins.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setEditAdmin(null);
        setForm({ name: '', email: '', phone: '', password: '' });
        setShowModal(true);
    };

    const openEdit = (admin) => {
        setEditAdmin(admin);
        setForm({ name: admin.name, email: admin.email, phone: admin.phone, password: '' });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name || !form.email) return;
        if (editAdmin) {
            setAdmins(admins.map(a => a.id === editAdmin.id ? { ...a, ...form } : a));
            setToast('Đã cập nhật thông tin quản trị viên!');
        } else {
            const newAdmin = { id: Date.now(), ...form, status: 'active', lastLogin: 'Chưa đăng nhập', createdAt: new Date().toISOString().split('T')[0] };
            setAdmins([...admins, newAdmin]);
            setToast('Đã thêm quản trị viên mới!');
        }
        setShowModal(false);
        setTimeout(() => setToast(''), 3000);
    };

    const toggleStatus = (id) => {
        setAdmins(admins.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
            setAdmins(admins.filter(a => a.id !== id));
            setToast('Đã xóa tài khoản quản trị viên!');
            setTimeout(() => setToast(''), 3000);
        }
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Quản trị viên</h2>
                    <p className="text-muted mb-0">Quản lý danh sách tài khoản Admin trong hệ thống</p>
                </div>
                <Button variant="primary" onClick={openAdd}>
                    <BiPlus className="me-2" />Thêm Admin
                </Button>
            </div>

            {toast && <Alert variant="success" onClose={() => setToast('')} dismissible>{toast}</Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng Admin', value: admins.length, color: 'primary' },
                    { label: 'Đang hoạt động', value: admins.filter(a => a.status === 'active').length, color: 'success' },
                    { label: 'Bị vô hiệu', value: admins.filter(a => a.status === 'inactive').length, color: 'danger' },
                ].map((s, i) => (
                    <Col md={4} key={i}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold text-uppercase mb-1`}>{s.label}</div>
                                <h3 className="fw-bold mb-0">{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text><BiSearch /></InputGroup.Text>
                        <Form.Control placeholder="Tìm theo tên hoặc email..." value={search} onChange={e => setSearch(e.target.value)} />
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>SĐT</th>
                                    <th>Lần cuối đăng nhập</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(admin => (
                                    <tr key={admin.id}>
                                        <td className="align-middle">
                                            <div className="fw-bold"><BiShield className="me-1 text-primary" />{admin.name}</div>
                                            <small className="text-muted">Tham gia: {new Date(admin.createdAt).toLocaleDateString('vi-VN')}</small>
                                        </td>
                                        <td className="align-middle">{admin.email}</td>
                                        <td className="align-middle">{admin.phone}</td>
                                        <td className="align-middle"><small>{admin.lastLogin}</small></td>
                                        <td className="align-middle">
                                            <Badge bg={admin.status === 'active' ? 'success' : 'secondary'}>
                                                {admin.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-1">
                                                <Button size="sm" variant="outline-primary" onClick={() => openEdit(admin)}><BiEdit /></Button>
                                                <Button size="sm" variant={admin.status === 'active' ? 'outline-warning' : 'outline-success'} onClick={() => toggleStatus(admin.id)}>
                                                    {admin.status === 'active' ? <BiLock /> : <BiLockOpen />}
                                                </Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(admin.id)}><BiTrash /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editAdmin ? 'Chỉnh sửa Admin' : 'Thêm Admin mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                            <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@badminton.vn" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxx" />
                        </Form.Group>
                        {!editAdmin && (
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Tối thiểu 8 ký tự" />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editAdmin ? 'Lưu thay đổi' : 'Thêm Admin'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Admins;
