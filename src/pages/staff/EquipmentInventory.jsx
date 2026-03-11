import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, ProgressBar } from 'react-bootstrap';
import { BiPackage, BiPlus, BiMinus, BiErrorCircle, BiEdit, BiSave } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';
import { mockEquipmentInventory } from '../../utils/mockAdminData';

const EquipmentInventory = () => {
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [damageDesc, setDamageDesc] = useState('');
    const [inventory, setInventory] = useState(mockEquipmentInventory);
    const [editQty, setEditQty] = useState('');
    const [editMin, setEditMin] = useState('');

    const updateQuantity = (id, change) => {
        setInventory(inventory.map(item =>
            item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change), lastUpdated: new Date().toISOString().split('T')[0] } : item
        ));
    };

    const saveEdit = () => {
        setInventory(inventory.map(item =>
            item.id === selectedItem.id
                ? { ...item, quantity: Number(editQty), minQuantity: Number(editMin), lastUpdated: new Date().toISOString().split('T')[0] }
                : item
        ));
        setShowEditModal(false);
    };

    const reportDamage = () => {
        alert(`✅ Đã ghi nhận báo cáo hư hỏng: ${selectedItem?.name}\n${damageDesc}`);
        setShowDamageModal(false);
        setDamageDesc('');
        setSelectedItem(null);
    };

    const getStockStatus = (item) => {
        const ratio = item.quantity / item.minQuantity;
        if (item.quantity === 0) return { label: 'Hết hàng', bg: 'danger', level: 0 };
        if (ratio < 1) return { label: 'Sắp hết', bg: 'danger', level: ratio * 100 };
        if (ratio < 1.5) return { label: 'Nên nhập', bg: 'warning', level: ratio * 70 };
        return { label: 'Đủ hàng', bg: 'success', level: 100 };
    };

    const criticalItems = inventory.filter(i => i.quantity < i.minQuantity);
    const warningItems = inventory.filter(i => i.quantity >= i.minQuantity && i.quantity < i.minQuantity * 1.5);

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2"><BiPackage className="me-2" />Quản lý thiết bị & vật tư</h2>
                <p className="text-muted mb-0">FE-02.10: Theo dõi tồn kho, cảnh báo số lượng thấp</p>
            </div>

            {/* Critical Alert Banner */}
            {criticalItems.length > 0 && (
                <Alert variant="danger" className="mb-3">
                    <div className="d-flex align-items-start gap-2">
                        <FiAlertTriangle size={22} className="mt-1 flex-shrink-0" />
                        <div className="w-100">
                            <strong>🚨 {criticalItems.length} mặt hàng SẮP HẾT - Cần nhập ngay!</strong>
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {criticalItems.map(item => (
                                    <Badge key={item.id} bg="danger" className="fs-6 py-2 px-3">
                                        {item.name}: {item.quantity}/{item.minQuantity} {item.unit}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Alert>
            )}

            {warningItems.length > 0 && criticalItems.length === 0 && (
                <Alert variant="warning" className="mb-3">
                    <FiAlertTriangle className="me-2" />
                    <strong>{warningItems.length} mặt hàng</strong> cần nhập thêm sắp tới.
                </Alert>
            )}

            {/* Stats */}
            <Row className="mb-4">
                {[
                    { label: 'Tổng mặt hàng', value: inventory.length, color: '' },
                    { label: 'Sắp hết / Hết', value: criticalItems.length, color: 'danger' },
                    { label: 'Nên nhập thêm', value: warningItems.length, color: 'warning' },
                    { label: 'Đủ hàng', value: inventory.length - criticalItems.length - warningItems.length, color: 'success' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className={`border-0 shadow-sm ${s.color ? `border-start border-${s.color} border-4` : ''}`}>
                            <Card.Body className="text-center">
                                <div className="text-muted small">{s.label}</div>
                                <h3 className={`mb-0 fw-bold ${s.color ? `text-${s.color}` : ''}`}>{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Danh sách thiết bị & vật tư</h6>
                    <Button size="sm" variant="outline-primary"><BiPlus className="me-1" />Nhập hàng mới</Button>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>STT</th>
                                <th>Tên vật tư</th>
                                <th>Vị trí</th>
                                <th>Nhà cung cấp</th>
                                <th>Số lượng</th>
                                <th>Tối thiểu</th>
                                <th>Mức độ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item, idx) => {
                                const status = getStockStatus(item);
                                return (
                                    <tr key={item.id} className={item.quantity < item.minQuantity ? 'table-danger' : ''}>
                                        <td className="align-middle">{idx + 1}</td>
                                        <td className="align-middle fw-bold">{item.name}</td>
                                        <td className="align-middle"><small className="text-muted">{item.location}</small></td>
                                        <td className="align-middle"><small>{item.supplier}</small></td>
                                        <td className="align-middle">
                                            <div className="d-flex align-items-center gap-1">
                                                <Button size="sm" variant="outline-danger" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity === 0}>-</Button>
                                                <span className={`fw-bold px-2 ${item.quantity < item.minQuantity ? 'text-danger' : ''}`}>
                                                    {item.quantity} {item.unit}
                                                </span>
                                                <Button size="sm" variant="outline-success" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                            </div>
                                        </td>
                                        <td className="align-middle text-muted">{item.minQuantity} {item.unit}</td>
                                        <td className="align-middle" style={{ minWidth: '120px' }}>
                                            <ProgressBar now={Math.min(status.level, 100)} variant={status.bg} style={{ height: '8px' }} />
                                            <small className="text-muted">{Math.round(status.level)}%</small>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={status.bg}>{status.label}</Badge>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-1">
                                                <Button size="sm" variant="outline-primary"
                                                    onClick={() => { setSelectedItem(item); setEditQty(item.quantity.toString()); setEditMin(item.minQuantity.toString()); setShowEditModal(true); }}>
                                                    <BiEdit />
                                                </Button>
                                                <Button size="sm" variant="outline-warning"
                                                    onClick={() => { setSelectedItem(item); setShowDamageModal(true); }}>
                                                    <BiErrorCircle />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton><Modal.Title><BiEdit className="me-2" />Cập nhật số lượng</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <>
                            <Alert variant="info">Mặt hàng: <strong>{selectedItem.name}</strong></Alert>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số lượng hiện tại</Form.Label>
                                        <Form.Control type="number" min="0" value={editQty} onChange={e => setEditQty(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngưỡng tối thiểu</Form.Label>
                                        <Form.Control type="number" min="1" value={editMin} onChange={e => setEditMin(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={saveEdit}><BiSave className="me-2" />Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* Damage Modal */}
            <Modal show={showDamageModal} onHide={() => setShowDamageModal(false)} centered>
                <Modal.Header closeButton><Modal.Title><BiErrorCircle className="me-2 text-warning" />Báo cáo hư hỏng</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <>
                            <Alert variant="info">Vật tư: <strong>{selectedItem.name}</strong> | SL: {selectedItem.quantity} {selectedItem.unit}</Alert>
                            <Form.Group>
                                <Form.Label>Mô tả hư hỏng <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Mô tả chi tiết..." value={damageDesc} onChange={e => setDamageDesc(e.target.value)} />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDamageModal(false)}>Hủy</Button>
                    <Button variant="warning" onClick={reportDamage} disabled={!damageDesc.trim()}><BiErrorCircle className="me-2" />Gửi báo cáo</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EquipmentInventory;
