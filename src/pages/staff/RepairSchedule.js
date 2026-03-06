import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { BiWrench, BiPlus, BiEdit, BiCheck, BiX } from 'react-icons/bi';

const RepairSchedule = () => {
    const [showModal, setShowModal] = useState(false);
    const [repairs, setRepairs] = useState([
        {
            id: 1,
            courtId: 6,
            courtName: 'Sân 6',
            issueType: 'Net',
            description: 'Lưới bị đứt, cần thay mới',
            urgency: 'high',
            status: 'pending',
            reportedBy: 'Trần Văn Staff',
            reportedAt: '2026-02-01T10:00:00',
            estimatedTime: '1 giờ'
        },
        {
            id: 2,
            courtId: 3,
            courtName: 'Sân 3',
            issueType: 'Lighting',
            description: 'Đèn sân số 2 không sáng',
            urgency: 'medium',
            status: 'in_progress',
            reportedBy: 'Nguyễn Staff B',
            reportedAt: '2026-01-31T14:30:00',
            estimatedTime: '30 phút'
        },
        {
            id: 3,
            courtId: 1,
            courtName: 'Sân 1',
            issueType: 'Floor',
            description: 'Sàn bị trơn một góc, cần lau chùi',
            urgency: 'low',
            status: 'completed',
            reportedBy: 'Trần Văn Staff',
            reportedAt: '2026-01-30T09:00:00',
            completedAt: '2026-01-30T10:00:00',
            estimatedTime: '30 phút'
        }
    ]);

    const [formData, setFormData] = useState({
        courtId: '',
        issueType: '',
        description: '',
        urgency: 'medium',
        estimatedTime: ''
    });

    const getUrgencyBadge = (urgency) => {
        const variants = {
            low: 'info',
            medium: 'warning',
            high: 'danger',
            critical: 'danger'
        };
        const labels = {
            low: 'Thấp',
            medium: 'Trung bình',
            high: 'Cao',
            critical: 'Khẩn cấp'
        };
        return <Badge bg={variants[urgency]}>{labels[urgency]}</Badge>;
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            in_progress: 'primary',
            completed: 'success',
            cancelled: 'secondary'
        };
        const labels = {
            pending: 'Chờ xử lý',
            in_progress: 'Đang sửa',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRepair = {
            id: repairs.length + 1,
            courtId: parseInt(formData.courtId),
            courtName: `Sân ${formData.courtId}`,
            issueType: formData.issueType,
            description: formData.description,
            urgency: formData.urgency,
            status: 'pending',
            reportedBy: 'Trần Văn Staff',
            reportedAt: new Date().toISOString(),
            estimatedTime: formData.estimatedTime
        };

        setRepairs([newRepair, ...repairs]);
        setShowModal(false);
        setFormData({
            courtId: '',
            issueType: '',
            description: '',
            urgency: 'medium',
            estimatedTime: ''
        });
    };

    const updateStatus = (id, newStatus) => {
        setRepairs(repairs.map(repair =>
            repair.id === id
                ? { ...repair, status: newStatus, ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }) }
                : repair
        ));
    };

    const pendingRepairs = repairs.filter(r => r.status === 'pending');
    const inProgressRepairs = repairs.filter(r => r.status === 'in_progress');
    const completedRepairs = repairs.filter(r => r.status === 'completed');

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Lịch sửa chữa</h2>
                    <p className="text-muted mb-0">Quản lý sửa chữa và bảo trì sân</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <BiPlus size={20} className="me-2" />
                    Thêm sửa chữa
                </Button>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4">
                        <Card.Body>
                            <div className="text-muted small">Chờ xử lý</div>
                            <h3 className="mb-0 text-warning">{pendingRepairs.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-primary border-4">
                        <Card.Body>
                            <div className="text-muted small">Đang sửa</div>
                            <h3 className="mb-0 text-primary">{inProgressRepairs.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4">
                        <Card.Body>
                            <div className="text-muted small">Hoàn thành</div>
                            <h3 className="mb-0 text-success">{completedRepairs.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-info border-4">
                        <Card.Body>
                            <div className="text-muted small">Tổng công việc</div>
                            <h3 className="mb-0 text-info">{repairs.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Repairs Table */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">
                        <BiWrench className="me-2" />
                        Danh sách sửa chữa
                    </h6>
                </Card.Header>
                <Card.Body className="p-0">
                    <div style={{ overflowX: 'auto' }}>
                        <Table responsive className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Sân</th>
                                    <th>Vấn đề</th>
                                    <th>Mô tả</th>
                                    <th>Mức độ</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian ước tính</th>
                                    <th>Báo cáo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repairs.map((repair) => (
                                    <tr key={repair.id}>
                                        <td>#{repair.id}</td>
                                        <td><strong>{repair.courtName}</strong></td>
                                        <td>{repair.issueType}</td>
                                        <td>{repair.description}</td>
                                        <td>{getUrgencyBadge(repair.urgency)}</td>
                                        <td>{getStatusBadge(repair.status)}</td>
                                        <td>{repair.estimatedTime}</td>
                                        <td>
                                            <small className="text-muted">
                                                {repair.reportedBy}<br />
                                                {new Date(repair.reportedAt).toLocaleString('vi-VN')}
                                            </small>
                                        </td>
                                        <td>
                                            {repair.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => updateStatus(repair.id, 'in_progress')}
                                                >
                                                    Bắt đầu
                                                </Button>
                                            )}
                                            {repair.status === 'in_progress' && (
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() => updateStatus(repair.id, 'completed')}
                                                >
                                                    <BiCheck size={16} /> Hoàn thành
                                                </Button>
                                            )}
                                            {repair.status === 'completed' && (
                                                <small className="text-success">
                                                    ✓ Xong lúc {new Date(repair.completedAt).toLocaleTimeString('vi-VN')}
                                                </small>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Add Repair Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <BiPlus className="me-2" />
                        Thêm lịch sửa chữa
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chọn sân</Form.Label>
                                    <Form.Select
                                        value={formData.courtId}
                                        onChange={(e) => setFormData({ ...formData, courtId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Chọn sân --</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={num}>Sân {num}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại sự cố</Form.Label>
                                    <Form.Select
                                        value={formData.issueType}
                                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Chọn loại --</option>
                                        <option value="Net">Lưới (Net)</option>
                                        <option value="Lighting">Đèn chiếu sáng</option>
                                        <option value="Floor">Sàn sân</option>
                                        <option value="Equipment">Thiết bị</option>
                                        <option value="Other">Khác</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả chi tiết</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Mô tả vấn đề cần sửa chữa..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mức độ ưu tiên</Form.Label>
                                    <Form.Select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                    >
                                        <option value="low">Thấp</option>
                                        <option value="medium">Trung bình</option>
                                        <option value="high">Cao</option>
                                        <option value="critical">Khẩn cấp</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Thời gian ước tính</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="VD: 1 giờ, 30 phút..."
                                        value={formData.estimatedTime}
                                        onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            <BiX className="me-2" /> Hủy
                        </Button>
                        <Button variant="primary" type="submit">
                            <BiCheck className="me-2" /> Tạo lịch sửa chữa
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default RepairSchedule;
