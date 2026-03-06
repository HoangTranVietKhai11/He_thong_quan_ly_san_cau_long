import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { BiError, BiCheckCircle, BiTime } from 'react-icons/bi';
import { mockEquipmentAlerts, ALERT_SEVERITY, ALERT_STATUS } from '../../../utils/mockAdminData';

const EquipmentAlerts = () => {
    const [alerts, setAlerts] = useState(mockEquipmentAlerts);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getSeverityBadge = (severity) => {
        const info = ALERT_SEVERITY[severity];
        return <Badge bg={info.color}>{info.label}</Badge>;
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            scheduled: 'info',
            urgent: 'danger',
            resolved: 'success'
        };
        return <Badge bg={variants[status]}>{ALERT_STATUS[status]}</Badge>;
    };

    let filteredAlerts = alerts;
    if (filterSeverity !== 'all') {
        filteredAlerts = filteredAlerts.filter(a => a.severity === filterSeverity);
    }
    if (filterStatus !== 'all') {
        filteredAlerts = filteredAlerts.filter(a => a.status === filterStatus);
    }

    const urgentCount = alerts.filter(a => a.status === 'urgent').length;
    const pendingCount = alerts.filter(a => a.status === 'pending').length;
    const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

    const handleResolve = (alertId) => {
        setAlerts(alerts.map(a =>
            a.id === alertId ? { ...a, status: 'resolved' } : a
        ));
        alert('Đã đánh dấu là đã giải quyết!');
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Cảnh báo thiết bị</h2>
                <p className="text-muted">Nhận cảnh báo hư hỏng thiết bị và cảnh báo bảo trì</p>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-danger border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiError size={40} className="text-danger me-3" />
                                <div>
                                    <div className="text-muted small">Khẩn cấp</div>
                                    <h3 className="fw-bold mb-0 text-danger">{urgentCount}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-warning border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiTime size={40} className="text-warning me-3" />
                                <div>
                                    <div className="text-muted small">Chờ xử lý</div>
                                    <h3 className="fw-bold mb-0 text-warning">{pendingCount}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-success border-4">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <BiCheckCircle size={40} className="text-success me-3" />
                                <div>
                                    <div className="text-muted small">Đã giải quyết</div>
                                    <h3 className="fw-bold mb-0 text-success">{resolvedCount}</h3>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng cảnh báo</div>
                            <h3 className="fw-bold mb-0">{alerts.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>Lọc theo mức độ:</Form.Label>
                                <Col sm={8}>
                                    <Form.Select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                                        <option value="all">Tất cả</option>
                                        <option value="low">Thấp</option>
                                        <option value="medium">Trung bình</option>
                                        <option value="high">Cao</option>
                                        <option value="critical">Nghiêm trọng</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>Lọc theo trạng thái:</Form.Label>
                                <Col sm={8}>
                                    <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="all">Tất cả</option>
                                        <option value="pending">Chờ xử lý</option>
                                        <option value="scheduled">Đã lên lịch</option>
                                        <option value="urgent">Khẩn cấp</option>
                                        <option value="resolved">Đã giải quyết</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Alerts Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Sân</th>
                                    <th>Thiết bị</th>
                                    <th>Loại cảnh báo</th>
                                    <th>Mô tả</th>
                                    <th>Ngày tạo</th>
                                    <th>Chi phí ước tính</th>
                                    <th>Mức độ</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAlerts.map((alert) => (
                                    <tr key={alert.id}>
                                        <td className="align-middle">
                                            <strong>{alert.courtName}</strong>
                                        </td>
                                        <td className="align-middle">{alert.equipmentType}</td>
                                        <td className="align-middle">{alert.alertType}</td>
                                        <td className="align-middle">
                                            <small>{alert.description}</small>
                                        </td>
                                        <td className="align-middle">{formatDate(alert.createdDate)}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(alert.estimatedCost)}</strong>
                                        </td>
                                        <td className="align-middle">{getSeverityBadge(alert.severity)}</td>
                                        <td className="align-middle">{getStatusBadge(alert.status)}</td>
                                        <td className="align-middle">
                                            {alert.status !== 'resolved' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => handleResolve(alert.id)}
                                                >
                                                    Đã xử lý
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EquipmentAlerts;
