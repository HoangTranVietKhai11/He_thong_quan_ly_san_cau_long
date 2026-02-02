import React, { useState } from 'react';
import { Container, Card, Table, Button, Badge, Form, Row, Col, Modal } from 'react-bootstrap';
import { BiPlus, BiCalendar, BiWrench, BiCheck } from 'react-icons/bi';
import { mockMaintenanceSchedule, MAINTENANCE_STATUS } from '../../../utils/mockAdminData';

const Maintenance = () => {
    const [schedules, setSchedules] = useState(mockMaintenanceSchedule);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const variants = {
            scheduled: 'primary',
            in_progress: 'warning',
            completed: 'success',
            cancelled: 'secondary'
        };
        return <Badge bg={variants[status]}>{MAINTENANCE_STATUS[status]}</Badge>;
    };

    const filteredSchedules = filterStatus === 'all'
        ? schedules
        : schedules.filter(s => s.status === filterStatus);

    const totalCost = schedules.reduce((sum, s) => sum + s.estimatedCost, 0);
    const completedCount = schedules.filter(s => s.status === 'completed').length;
    const upcomingCount = schedules.filter(s => s.status === 'scheduled').length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Lịch bảo trì</h2>
                    <p className="text-muted">Quản lý lịch bảo trì và cập nhật trạng thái sân</p>
                </div>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <BiPlus className="me-2" />
                    Thêm lịch bảo trì
                </Button>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCalendar size={30} className="text-primary mb-2" />
                            <div className="text-muted small">Sắp tới</div>
                            <h3 className="fw-bold mb-0">{upcomingCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiWrench size={30} className="text-warning mb-2" />
                            <div className="text-muted small">Đang thực hiện</div>
                            <h3 className="fw-bold mb-0">
                                {schedules.filter(s => s.status === 'in_progress').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCheck size={30} className="text-success mb-2" />
                            <div className="text-muted small">Hoàn thành</div>
                            <h3 className="fw-bold mb-0">{completedCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng chi phí</div>
                            <h4 className="fw-bold mb-0 text-danger">{formatPrice(totalCost)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Form.Group as={Row} className="mb-0">
                        <Form.Label column sm={2}>Lọc theo trạng thái:</Form.Label>
                        <Col sm={4}>
                            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">Tất cả</option>
                                <option value="scheduled">Đã lên lịch</option>
                                <option value="in_progress">Đang thực hiện</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>

            {/* Maintenance Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
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
                                {filteredSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="align-middle">
                                            <strong>{schedule.courtName}</strong>
                                        </td>
                                        <td className="align-middle">{schedule.type}</td>
                                        <td className="align-middle">
                                            <small>{schedule.description}</small>
                                        </td>
                                        <td className="align-middle">{formatDate(schedule.scheduledDate)}</td>
                                        <td className="align-middle">{schedule.duration}</td>
                                        <td className="align-middle">{schedule.assignedTo}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">
                                                {formatPrice(schedule.estimatedCost)}
                                            </strong>
                                        </td>
                                        <td className="align-middle">{getStatusBadge(schedule.status)}</td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="outline-primary">Chi tiết</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Add Maintenance Modal - Placeholder */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm lịch bảo trì mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">Form thêm lịch bảo trì sẽ được triển khai sau</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Maintenance;
