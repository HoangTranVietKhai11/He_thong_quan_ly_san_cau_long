import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { BiPackage, BiPlus, BiMinus, BiErrorCircle, BiEdit } from 'react-icons/bi';

const EquipmentInventory = () => {
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [damageDesc, setDamageDesc] = useState('');

    const [inventory, setInventory] = useState([
        {
            id: 1,
            name: 'Quả cầu (Shuttlecock)',
            category: 'Consumables',
            quantity: 150,
            minThreshold: 50,
            unit: 'quả',
            lastRestock: '2026-01-28'
        },
        {
            id: 2,
            name: 'Vợt cho thuê',
            category: 'Equipment',
            quantity: 25,
            minThreshold: 10,
            unit: 'cái',
            lastRestock: '2026-01-15'
        },
        {
            id: 3,
            name: 'Lưới cầu lông',
            category: 'Equipment',
            quantity: 8,
            minThreshold: 2,
            unit: 'cái',
            lastRestock: '2026-01-10'
        },
        {
            id: 4,
            name: 'Bóng đèn LED',
            category: 'Maintenance',
            quantity: 5,
            minThreshold: 10,
            unit: 'bóng',
            lastRestock: '2026-01-20'
        },
        {
            id: 5,
            name: 'Dây cót vợt',
            category: 'Consumables',
            quantity: 45,
            minThreshold: 20,
            unit: 'cuộn',
            lastRestock: '2026-01-25'
        },
        {
            id: 6,
            name: 'Băng quấn cán vợt',
            category: 'Consumables',
            quantity: 30,
            minThreshold: 15,
            unit: 'cuộn',
            lastRestock: '2026-01-22'
        },
        {
            id: 7,
            name: 'Ghế ngồi chờ',
            category: 'Furniture',
            quantity: 20,
            minThreshold: 15,
            unit: 'cái',
            lastRestock: '2025-12-01'
        },
        {
            id: 8,
            name: 'Nước uống chai',
            category: 'Beverage',
            quantity: 80,
            minThreshold: 50,
            unit: 'chai',
            lastRestock: '2026-02-01'
        }
    ]);

    const updateQuantity = (id, change) => {
        setInventory(inventory.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + change) }
                : item
        ));
    };

    const reportDamage = () => {
        console.log('Reporting damage for:', selectedItem, damageDesc);
        setShowDamageModal(false);
        setDamageDesc('');
        setSelectedItem(null);
    };

    const getLowStockItems = () => {
        return inventory.filter(item => item.quantity < item.minThreshold);
    };

    const getCategoryBadge = (category) => {
        const colors = {
            'Consumables': 'warning',
            'Equipment': 'primary',
            'Maintenance': 'danger',
            'Furniture': 'info',
            'Beverage': 'success'
        };
        return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
    };

    const lowStockItems = getLowStockItems();

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">
                    <BiPackage className="me-2" />
                    Quản lý thiết bị & vật tư
                </h2>
                <p className="text-muted mb-0">Theo dõi tồn kho và tình trạng thiết bị</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <Alert variant="warning" className="mb-4">
                    <BiErrorCircle size={20} className="me-2" />
                    <strong>Cảnh báo!</strong> Có {lowStockItems.length} mặt hàng sắp hết hàng:
                    <ul className="mb-0 mt-2">
                        {lowStockItems.map(item => (
                            <li key={item.id}>
                                {item.name}: <strong>{item.quantity} {item.unit}</strong> (Tối thiểu: {item.minThreshold})
                            </li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="text-muted small">Tổng mặt hàng</div>
                            <h3 className="mb-0">{inventory.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4">
                        <Card.Body>
                            <div className="text-muted small">Sắp hết hàng</div>
                            <h3 className="mb-0 text-warning">{lowStockItems.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4">
                        <Card.Body>
                            <div className="text-muted small">Vợt cho thuê</div>
                            <h3 className="mb-0 text-success">
                                {inventory.find(i => i.id === 2)?.quantity || 0}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4">
                        <Card.Body>
                            <div className="text-muted small">Quả cầu</div>
                            <h3 className="mb-0 text-info">
                                {inventory.find(i => i.id === 1)?.quantity || 0}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Inventory Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">Danh sách thiết bị & vật tư</h6>
                </Card.Header>
                <Card.Body className="p-0">
                    <div style={{ overflowX: 'auto' }}>
                        <Table responsive className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>STT</th>
                                    <th>Tên vật tư</th>
                                    <th>Danh mục</th>
                                    <th>Số lượng</th>
                                    <th>Tối thiểu</th>
                                    <th>Đơn vị</th>
                                    <th>Nhập lần cuối</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{item.name}</strong></td>
                                        <td>{getCategoryBadge(item.category)}</td>
                                        <td>
                                            <span className={item.quantity < item.minThreshold ? 'text-danger fw-bold' : 'fw-bold'}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="text-muted">{item.minThreshold}</td>
                                        <td>{item.unit}</td>
                                        <td>
                                            <small>{new Date(item.lastRestock).toLocaleDateString('vi-VN')}</small>
                                        </td>
                                        <td>
                                            {item.quantity < item.minThreshold ? (
                                                <Badge bg="danger">Sắp hết</Badge>
                                            ) : item.quantity < item.minThreshold * 1.5 ? (
                                                <Badge bg="warning">Nên nhập thêm</Badge>
                                            ) : (
                                                <Badge bg="success">Đủ hàng</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    title="Thêm"
                                                >
                                                    <BiPlus />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    disabled={item.quantity === 0}
                                                    title="Trừ"
                                                >
                                                    <BiMinus />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setShowDamageModal(true);
                                                    }}
                                                    title="Báo hỏng"
                                                >
                                                    <BiErrorCircle />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Damage Report Modal */}
            <Modal show={showDamageModal} onHide={() => setShowDamageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <BiErrorCircle className="me-2 text-warning" />
                        Báo cáo thiết bị hư hỏng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <>
                            <Alert variant="info">
                                Vật tư: <strong>{selectedItem.name}</strong><br />
                                Số lượng hiện tại: <strong>{selectedItem.quantity} {selectedItem.unit}</strong>
                            </Alert>
                            <Form.Group>
                                <Form.Label>Mô tả tình trạng hư hỏng</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Mô tả chi tiết vấn đề..."
                                    value={damageDesc}
                                    onChange={(e) => setDamageDesc(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDamageModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="warning" onClick={reportDamage} disabled={!damageDesc.trim()}>
                        <BiErrorCircle className="me-2" />
                        Gửi báo cáo
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EquipmentInventory;
