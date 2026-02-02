import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { mockCourts } from '../../utils/mockData';
import FACILITY_INFO from '../../config/facility';

const Courts = () => {
    const [courts, setCourts] = useState(mockCourts);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [formData, setFormData] = useState({
        courtNumber: '',
        type: 'STANDARD',
        pricePerHour: '80000',
        description: ''
    });

    const resetForm = () => {
        setFormData({
            courtNumber: '',
            type: 'STANDARD',
            pricePerHour: '80000',
            description: ''
        });
    };

    const handleCreate = () => {
        const newCourt = {
            id: courts.length + 1,
            courtNumber: Number(formData.courtNumber),
            courtName: `Court ${formData.courtNumber}`,
            type: formData.type,
            pricePerHour: Number(formData.pricePerHour),
            status: 'available',
            description: formData.description,
            features: formData.type === 'VIP'
                ? ['Ánh sáng LED cao cấp', 'Mặt sân chuyên nghiệp', 'Điều hòa']
                : ['Ánh sáng tốt', 'Mặt sân chuẩn'],
            lastMaintenance: new Date().toISOString().split('T')[0],
            nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        setCourts([...courts, newCourt]);
        setShowCreateModal(false);
        resetForm();
    };

    const handleEdit = (court) => {
        setSelectedCourt(court);
        setFormData({
            courtNumber: court.courtNumber.toString(),
            type: court.type,
            pricePerHour: court.pricePerHour.toString(),
            description: court.description || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setCourts(courts.map(c =>
            c.id === selectedCourt.id
                ? {
                    ...c,
                    courtNumber: Number(formData.courtNumber),
                    courtName: `Court ${formData.courtNumber}`,
                    type: formData.type,
                    pricePerHour: Number(formData.pricePerHour),
                    description: formData.description
                }
                : c
        ));
        setShowEditModal(false);
        resetForm();
    };

    const handleDelete = (courtId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
            setCourts(courts.filter(c => c.id !== courtId));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'success';
            case 'in_use': return 'primary';
            case 'maintenance': return 'warning';
            case 'closed': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available': return 'Sẵn sàng';
            case 'in_use': return 'Đang sử dụng';
            case 'maintenance': return 'Bảo trì';
            case 'closed': return 'Đóng cửa';
            default: return status;
        }
    };

    const renderForm = () => (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Số sân *</Form.Label>
                        <Form.Control
                            type="number"
                            name="courtNumber"
                            placeholder="1"
                            min="1"
                            value={formData.courtNumber}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Sẽ tạo thành "Court 1", "Court 2", v.v.
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Loại sân *</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="STANDARD">Tiêu chuẩn - 80k/giờ</option>
                            <option value="VIP">VIP - 100k/giờ</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Giá/giờ (VNĐ) *</Form.Label>
                <Form.Control
                    type="number"
                    name="pricePerHour"
                    placeholder="80000"
                    min="0"
                    step="10000"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Mô tả về sân (tùy chọn)"
                    value={formData.description}
                    onChange={handleChange}
                />
            </Form.Group>
        </Form>
    );

    return (
        <Container fluid className="py-4">
            {/* Facility Header */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">{FACILITY_INFO.name}</h2>
                <p className="text-muted mb-0">
                    <small>{FACILITY_INFO.address} • {FACILITY_INFO.phone}</small>
                </p>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Quản lý sân ({courts.length} sân)</h4>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <FiPlus className="me-2" />
                    Thêm sân mới
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Sân</th>
                                <th>Loại</th>
                                <th>Giá/giờ</th>
                                <th>Trạng thái</th>
                                <th>Mô tả</th>
                                <th>Bảo trì cuối</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courts
                                .sort((a, b) => a.courtNumber - b.courtNumber)
                                .map(court => (
                                    <tr key={court.id}>
                                        <td className="fw-bold">{court.courtName}</td>
                                        <td>
                                            <Badge bg={court.type === 'VIP' ? 'warning' : 'info'} text="dark">
                                                {court.type === 'VIP' ? 'VIP' : 'Tiêu chuẩn'}
                                            </Badge>
                                        </td>
                                        <td>{formatPrice(court.pricePerHour)}</td>
                                        <td>
                                            <Badge bg={getStatusColor(court.status)}>
                                                {getStatusText(court.status)}
                                            </Badge>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {court.description?.substring(0, 40)}...
                                            </small>
                                        </td>
                                        <td>
                                            <small>{new Date(court.lastMaintenance).toLocaleDateString('vi-VN')}</small>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleEdit(court)}
                                                >
                                                    <FiEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(court.id)}
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <FiPlus className="me-2" />
                        Thêm Sân Mới
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleCreate}>
                        <FiPlus className="me-2" />
                        Tạo sân
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <FiEdit className="me-2" />
                        Chỉnh Sửa Sân
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        <FiEdit className="me-2" />
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Courts;
