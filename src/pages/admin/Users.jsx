import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form, InputGroup, Modal, Alert, Spinner } from 'react-bootstrap';
import { BiPlus, BiSearch, BiEdit, BiTrash } from 'react-icons/bi';
import adminService from '../../services/adminService';

const ROLE_COLORS = {
    Admin: 'danger', admin: 'danger',
    Staff: 'warning', staff: 'warning',
    User: 'primary', user: 'primary'
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllUsers({ search });
            setUsers(res.data || []);
        } catch (e) {
            setError('Không thể tải danh sách người dùng: ' + (e.response?.data?.message || e.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setEditRole(user.role);
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        setSaving(true);
        try {
            await adminService.updateUser(editingUser.id, { role: editRole });
            setSuccessMsg(`Đã cập nhật quyền cho ${editingUser.username} thành công!`);
            setShowEditModal(false);
            fetchUsers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (e) {
            setError('Lỗi cập nhật: ' + (e.response?.data?.message || e.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Xác nhận xóa người dùng "${user.username}"?`)) return;
        try {
            await adminService.deleteUser(user.id);
            setSuccessMsg(`Đã xóa người dùng ${user.username}.`);
            fetchUsers();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (e) {
            setError('Lỗi xóa: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý người dùng</h2>
            </div>

            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Tìm theo tên hoặc email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button variant="primary" type="submit"><BiSearch /></Button>
                        </InputGroup>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>ID</th><th>Tên</th><th>Email</th><th>Vai trò</th>
                                    <th>Số dư ví</th><th>Ngày tham gia</th><th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td><strong>{user.username}</strong></td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Badge bg={ROLE_COLORS[user.role] || 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>{(user.wallet_balance || 0).toLocaleString('vi-VN')} ₫</td>
                                        <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '-'}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" size="sm" onClick={() => openEdit(user)}>
                                                    <BiEdit />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user)}>
                                                    <BiTrash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {!loading && users.length === 0 && (
                        <div className="text-center py-5 text-muted">Không tìm thấy người dùng nào.</div>
                    )}
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa quyền: {editingUser?.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Select value={editRole} onChange={e => setEditRole(e.target.value)}>
                            <option value="User">User</option>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={saveEdit} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : 'Lưu thay đổi'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Users;
