import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { BiPlus, BiPencil, BiTrash } from 'react-icons/bi';
import ownerService from '../../services/ownerService';

const Courts = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', phone_number: '', manager_name: '', status: 'Active' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const res = await ownerService.getAllFacilities();
            setFacilities(res.data?.data || res.data || []);
        } catch (err) {
            setError('Lỗi tải danh sách cơ sở: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setFormData({ name: '', address: '', phone_number: '', manager_name: '', status: 'Active' });
        setIsEditing(false);
        setEditId(null);
        setError('');
    };

    const handleShowAdd = () => setShowModal(true);

    const handleShowEdit = (facility) => {
        setFormData({
            name: facility.name,
            address: facility.address,
            phone_number: facility.phone_number || '',
            manager_name: facility.manager_name || '',
            status: facility.status || 'Active'
        });
        setEditId(facility.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEditing) {
                await ownerService.updateFacility(editId, formData);
            } else {
                await ownerService.createFacility(formData);
            }
            handleClose();
            fetchFacilities();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cơ sở này? Quá trình này không thể hoàn tác nếu chưa có sân nào bên trong.')) {
            try {
                await ownerService.deleteFacility(id);
                fetchFacilities();
            } catch (err) {
                alert('Lỗi xóa: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý Cơ sở (Facilities)</h2>
                <Button variant="primary" onClick={handleShowAdd}>
                    <BiPlus size={20} className="me-2" />
                    Thêm cơ sở mới
                </Button>
            </div>

            {error && !showModal && <Alert variant="danger">{error}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover className="align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Tên Cơ sở</th>
                                <th>Địa chỉ</th>
                                <th>Liên hệ</th>
                                <th>Quản lý</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facilities.map(facility => (
                                <tr key={facility.id}>
                                    <td>#{facility.id}</td>
                                    <td className="fw-bold">{facility.name}</td>
                                    <td>{facility.address}</td>
                                    <td>{facility.phone_number || 'N/A'}</td>
                                    <td>{facility.manager_name || 'N/A'}</td>
                                    <td>
                                        <Badge bg={facility.status === 'Active' ? 'success' : facility.status === 'Maintenance' ? 'warning' : 'danger'}>
                                            {facility.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleShowEdit(facility)}>
                                                <BiPencil />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(facility.id)}>
                                                <BiTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {facilities.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">Chưa có dữ liệu cơ sở</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Update/Add */}
            <Modal show={showModal} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Cập nhật Cơ sở' : 'Thêm Cơ sở Mới'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && showModal && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Tên Cơ sở *</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ *</Form.Label>
                            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên Quản lý</Form.Label>
                                    <Form.Control type="text" name="manager_name" value={formData.manager_name} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Active">Đang hoạt động (Active)</option>
                                <option value="Maintenance">Bảo trì (Maintenance)</option>
                                <option value="Closed">Đóng cửa (Closed)</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? <Spinner size="sm" /> : 'Lưu Cơ sở'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Courts;
