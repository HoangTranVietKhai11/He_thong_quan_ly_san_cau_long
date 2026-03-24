import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { BiPackage, BiPlus, BiMinus, BiErrorCircle, BiEdit, BiSave, BiTrash, BiRefresh } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';
import staffOpsService from '../../services/staffOpsService';

const EquipmentInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'Other', price: 0, stock: 0 });

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await staffOpsService.getEquipments();
            setInventory(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách vật tư. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setSelectedItem(item);
            setFormData({ name: item.name, type: item.type, price: item.price, stock: item.stock });
        } else {
            setSelectedItem(null);
            setFormData({ name: '', type: 'Other', price: 0, stock: 0 });
        }
        setShowEditModal(true);
    };

    const handleSave = async () => {
        try {
            if (selectedItem) {
                await staffOpsService.updateEquipment(selectedItem.id, formData);
            } else {
                await staffOpsService.addEquipment(formData);
            }
            setShowEditModal(false);
            fetchInventory();
        } catch (err) {
            alert('Lỗi khi lưu dữ liệu');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
            try {
                await staffOpsService.deleteEquipment(id);
                fetchInventory();
            } catch (err) {
                alert('Lỗi khi xóa');
            }
        }
    };

    const updateStock = async (item, change) => {
        try {
            const newStock = Math.max(0, item.stock + change);
            await staffOpsService.updateEquipment(item.id, { ...item, stock: newStock });
            fetchInventory();
        } catch (err) {
            alert('Lỗi khi cập nhật số lượng');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Hết hàng', bg: 'danger', percent: 0 };
        if (stock < 10) return { label: 'Sắp hết', bg: 'warning', percent: (stock / 10) * 100 };
        return { label: 'Đủ hàng', bg: 'success', percent: 100 };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading && inventory.length === 0) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu kho...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2"><BiPackage className="me-2" />Quản lý kho vật tư</h2>
                    <p className="text-muted mb-0">Theo dõi tồn kho dụng cụ, nước uống và thiết bị</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={fetchInventory}><BiRefresh className="me-1" /> Làm mới</Button>
                    <Button variant="primary" onClick={() => handleOpenModal()}><BiPlus className="me-1" /> Thêm vật tư</Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                {[
                    { label: 'Tổng số mặt hàng', value: inventory.length, icon: <BiPackage />, color: 'primary' },
                    { label: 'Hết hàng', value: inventory.filter(i => i.stock === 0).length, icon: <BiErrorCircle />, color: 'danger' },
                    { label: 'Sắp hết', value: inventory.filter(i => i.stock > 0 && i.stock < 10).length, icon: <FiAlertTriangle />, color: 'warning' },
                ].map((s, i) => (
                    <Col md={4} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center">
                                <div className={`p-3 rounded bg-${s.color} bg-opacity-10 text-${s.color} me-3`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div className="text-muted small">{s.label}</div>
                                    <h3 className="mb-0 fw-bold">{s.value}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="bg-light text-muted small text-uppercase">
                            <tr>
                                <th className="px-4 py-3">Tên vật tư</th>
                                <th className="py-3">Loại</th>
                                <th className="py-3">Giá bán</th>
                                <th className="py-3">Tồn kho</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3 text-end px-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => {
                                const status = getStockStatus(item.stock);
                                return (
                                    <tr key={item.id}>
                                        <td className="px-4 align-middle fw-bold">{item.name}</td>
                                        <td className="align-middle">
                                            <Badge bg="info" className="fw-normal">{item.type}</Badge>
                                        </td>
                                        <td className="align-middle text-primary fw-medium">{formatPrice(item.price)}</td>
                                        <td className="align-middle" style={{ minWidth: '150px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <Button size="sm" variant="outline-danger" onClick={() => updateStock(item, -1)}>-</Button>
                                                <span className="fw-bold mx-1">{item.stock}</span>
                                                <Button size="sm" variant="outline-success" onClick={() => updateStock(item, 1)}>+</Button>
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={status.bg}>{status.label}</Badge>
                                        </td>
                                        <td className="text-end px-4 align-middle">
                                            <Button size="sm" variant="link" className="text-primary p-0 me-3" onClick={() => handleOpenModal(item)}>
                                                <BiEdit size={18} />
                                            </Button>
                                            <Button size="sm" variant="link" className="text-danger p-0" onClick={() => handleDelete(item.id)}>
                                                <BiTrash size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Chưa có vật tư nào trong kho</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Add/Edit */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem ? 'Cập nhật vật tư' : 'Thêm vật tư mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên vật tư <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                placeholder="Vd: Nước suối Lavie 500ml"
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại</Form.Label>
                                    <Form.Select 
                                        value={formData.type} 
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Drink">Đồ uống</option>
                                        <option value="Shuttlecock">Quả cầu lông</option>
                                        <option value="Rental">Đồ cho thuê</option>
                                        <option value="Other">Khác</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Giá bán (VND)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={formData.price} 
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Số lượng tồn kho</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={formData.stock} 
                                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>
                        <BiSave className="me-1" /> {selectedItem ? 'Lưu thay đổi' : 'Thêm mới'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EquipmentInventory;
