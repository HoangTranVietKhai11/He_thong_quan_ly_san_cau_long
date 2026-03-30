import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { BiPlus, BiCalendar, BiWrench, BiCheck } from 'react-icons/bi';
import { FiAlertTriangle } from 'react-icons/fi';

const courts = ['Sân 1', 'Sân 2', 'Sân 3', 'Sân VIP', 'Sân đôi'];

const Maintenance = () => {
    const [schedules, setSchedules] = useState([]);
    const MAINTENANCE_STATUS = {
        scheduled: 'Đã lên lịch',
        in_progress: 'Đang thực hiện',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    const mockBookings = [];
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [affectedBookings, setAffectedBookings] = useState([]);
    const [newForm, setNewForm] = useState({
        courtName: 'Sân 1',
        type: 'Bảo trì định kỳ',
        description: '',
        scheduledDate: '',
        scheduledTime: '08:00',
        duration: '2',
        assignedTo: '',
        estimatedCost: ''
    });

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

    const getStatusBadge = (status) => {
        const variants = { scheduled: 'primary', in_progress: 'warning', completed: 'success', cancelled: 'secondary' };
        return <Badge bg={variants[status]}>{MAINTENANCE_STATUS[status]}</Badge>;
    };

    const filteredSchedules = filterStatus === 'all' ? schedules : schedules.filter(s => s.status === filterStatus);
    const totalCost = schedules.reduce((sum, s) => sum + s.estimatedCost, 0);
    const completedCount = schedules.filter(s => s.status === 'completed').length;
    const upcomingCount = schedules.filter(s => s.status === 'scheduled').length;

    // Check affected bookings when court and date are selected
    const checkAffectedBookings = (courtName, date) => {
        const affected = mockBookings.filter(b =>
            b.courtName === courtName && b.date === date &&
            (b.status === 'confirmed' || b.status === 'pending')
        );
        setAffectedBookings(affected);
    };

    const handleFormChange = (field, value) => {
        const updated = { ...newForm, [field]: value };
        setNewForm(updated);
        if (field === 'courtName' || field === 'scheduledDate') {
            checkAffectedBookings(
                field === 'courtName' ? value : updated.courtName,
                field === 'scheduledDate' ? value : updated.scheduledDate
            );
        }
    };

    const handleAddSchedule = () => {
        if (!newForm.scheduledDate || !newForm.description || !newForm.assignedTo) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        const newSchedule = {
            id: schedules.length + 1,
            courtId: courts.indexOf(newForm.courtName) + 1,
            courtName: newForm.courtName,
            type: newForm.type,
            description: newForm.description,
            scheduledDate: newForm.scheduledDate,
            duration: `${newForm.duration} giờ`,
            status: 'scheduled',
            assignedTo: newForm.assignedTo,
            estimatedCost: Number(newForm.estimatedCost) || 0
        };
        setSchedules([...schedules, newSchedule]);
        setShowModal(false);
        setNewForm({ courtName: 'Sân 1', type: 'Bảo trì định kỳ', description: '', scheduledDate: '', scheduledTime: '08:00', duration: '2', assignedTo: '', estimatedCost: '' });
        setAffectedBookings([]);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Lịch bảo trì</h2>
                    <p className="text-muted">Quản lý lịch bảo trì và cảnh báo booking bị ảnh hưởng</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <BiPlus className="me-2" />Thêm lịch bảo trì
                </Button>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-4 border-primary">
                        <Card.Body className="text-center">
                            <BiCalendar size={30} className="text-primary mb-2" />
                            <div className="text-muted small">Sắp tới</div>
                            <h3 className="fw-bold mb-0">{upcomingCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-4 border-warning">
                        <Card.Body className="text-center">
                            <BiWrench size={30} className="text-warning mb-2" />
                            <div className="text-muted small">Đang thực hiện</div>
                            <h3 className="fw-bold mb-0">{schedules.filter(s => s.status === 'in_progress').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-4 border-success">
                        <Card.Body className="text-center">
                            <BiCheck size={30} className="text-success mb-2" />
                            <div className="text-muted small">Hoàn thành</div>
                            <h3 className="fw-bold mb-0">{completedCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-4 border-danger">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng chi phí</div>
                            <h4 className="fw-bold mb-0 text-danger">{formatPrice(totalCost)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="py-2">
                    <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold">Lọc:</span>
                        {['all', 'scheduled', 'in_progress', 'completed', 'cancelled'].map(s => (
                            <Button
                                key={s}
                                size="sm"
                                variant={filterStatus === s ? 'primary' : 'outline-secondary'}
                                onClick={() => setFilterStatus(s)}
                            >
                                {s === 'all' ? 'Tất cả' : MAINTENANCE_STATUS[s]}
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Maintenance Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Sân</th>
                                <th>Loại</th>
                                <th>Mô tả</th>
                                <th>Ngày thực hiện</th>
                                <th>Thời gian</th>
                                <th>Người phụ trách</th>
                                <th>Chi phí</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map(s => (
                                <tr key={s.id}>
                                    <td className="align-middle fw-bold">{s.courtName}</td>
                                    <td className="align-middle"><Badge bg="light" text="dark" className="border">{s.type}</Badge></td>
                                    <td className="align-middle"><small>{s.description}</small></td>
                                    <td className="align-middle">{formatDate(s.scheduledDate)}</td>
                                    <td className="align-middle">{s.duration}</td>
                                    <td className="align-middle">{s.assignedTo}</td>
                                    <td className="align-middle fw-bold text-primary">{formatPrice(s.estimatedCost)}</td>
                                    <td className="align-middle">{getStatusBadge(s.status)}</td>
                                    <td className="align-middle">
                                        <Button size="sm" variant="outline-primary">Chi tiết</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add Maintenance Modal */}
            <Modal show={showModal} onHide={() => { setShowModal(false); setAffectedBookings([]); }} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><BiPlus className="me-2" />Thêm lịch bảo trì mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Affected Bookings Warning */}
                    {affectedBookings.length > 0 && (
                        <Alert variant="warning" className="mb-3">
                            <FiAlertTriangle className="me-2" />
                            <strong>⚠️ Cảnh báo: {affectedBookings.length} booking bị ảnh hưởng!</strong>
                            <div className="mt-2">
                                {affectedBookings.map(b => (
                                    <div key={b.id} className="d-flex justify-content-between border-top pt-1 mt-1">
                                        <span><strong>{b.userName}</strong> - {b.timeSlot}</span>
                                        <Badge bg="warning" text="dark">{b.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}</Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 small text-muted">Hệ thống sẽ tự động thông báo cho khách hàng bị ảnh hưởng.</div>
                        </Alert>
                    )}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Sân <span className="text-danger">*</span></Form.Label>
                                <Form.Select value={newForm.courtName} onChange={e => handleFormChange('courtName', e.target.value)}>
                                    {courts.map(c => <option key={c} value={c}>{c}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Loại bảo trì</Form.Label>
                                <Form.Select value={newForm.type} onChange={e => handleFormChange('type', e.target.value)}>
                                    <option>Bảo trì định kỳ</option>
                                    <option>Sửa chữa khẩn cấp</option>
                                    <option>Vệ sinh</option>
                                    <option>Nâng cấp</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày thực hiện <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" value={newForm.scheduledDate} onChange={e => handleFormChange('scheduledDate', e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Giờ bắt đầu</Form.Label>
                                <Form.Control type="time" value={newForm.scheduledTime} onChange={e => handleFormChange('scheduledTime', e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Thời lượng (giờ)</Form.Label>
                                <Form.Control type="number" min="1" max="12" value={newForm.duration} onChange={e => handleFormChange('duration', e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả công việc <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="VD: Thay lưới, sơn lại mặt sân..." value={newForm.description} onChange={e => handleFormChange('description', e.target.value)} />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Người phụ trách <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Tên nhân viên" value={newForm.assignedTo} onChange={e => handleFormChange('assignedTo', e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Chi phí dự kiến (VNĐ)</Form.Label>
                                <Form.Control type="number" step="50000" placeholder="0" value={newForm.estimatedCost} onChange={e => handleFormChange('estimatedCost', e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); setAffectedBookings([]); }}>Hủy</Button>
                    <Button variant="primary" onClick={handleAddSchedule}>
                        <BiPlus className="me-2" />Tạo lịch bảo trì
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Maintenance;
