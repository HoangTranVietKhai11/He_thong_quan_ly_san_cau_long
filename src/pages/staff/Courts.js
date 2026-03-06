import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import { FiGrid, FiEdit, FiTool, FiEye, FiRefreshCw } from 'react-icons/fi';
import { mockCourtStatus } from '../../utils/mockData';

const Courts = () => {
    const [courts, setCourts] = useState(mockCourtStatus);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [maintenanceNotes, setMaintenanceNotes] = useState('');

    const getStatusBadge = (status) => {
        const config = {
            available: { bg: 'success', label: 'Sẵn sàng', icon: '✓' },
            in_use: { bg: 'primary', label: 'Đang sử dụng', icon: '●' },
            maintenance: { bg: 'warning', label: 'Bảo trì', icon: '⚙' },
            closed: { bg: 'danger', label: 'Đóng cửa', icon: '✕' }
        };
        const cfg = config[status] || config.available;
        return <Badge bg={cfg.bg}>{cfg.icon} {cfg.label}</Badge>;
    };

    const handleStatusChange = (courtId, newStatus) => {
        setCourts(courts.map(court =>
            court.id === courtId
                ? { ...court, status: newStatus, lastUpdated: new Date().toISOString() }
                : court
        ));
    };

    const openMaintenanceModal = (court) => {
        setSelectedCourt(court);
        setMaintenanceNotes(court.notes || '');
        setShowMaintenanceModal(true);
    };

    const handleMaintenance = () => {
        if (selectedCourt) {
            setCourts(courts.map(court =>
                court.id === selectedCourt.id
                    ? {
                        ...court,
                        status: 'maintenance',
                        notes: maintenanceNotes,
                        lastMaintenance: new Date().toISOString().split('T')[0],
                        lastUpdated: new Date().toISOString()
                    }
                    : court
            ));
            setShowMaintenanceModal(false);
            setMaintenanceNotes('');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            available: '#10b981',
            in_use: '#3b82f6',
            maintenance: '#f59e0b',
            closed: '#ef4444'
        };
        return colors[status] || colors.available;
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        <FiGrid className="me-2 text-success" />
                        Quản Lý Sân
                    </h3>
                    <p className="text-muted mb-0">Theo dõi và quản lý trạng thái các sân</p>
                </div>
                <Button variant="outline-primary">
                    <FiRefreshCw className="me-2" />
                    Làm mới
                </Button>
            </div>

            {/* Stats */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start-success">
                        <Card.Body className="text-center">
                            <h4 className="text-success mb-1">
                                {courts.filter(c => c.status === 'available').length}
                            </h4>
                            <div className="small text-muted">Sẵn sàng</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start-primary">
                        <Card.Body className="text-center">
                            <h4 className="text-primary mb-1">
                                {courts.filter(c => c.status === 'in_use').length}
                            </h4>
                            <div className="small text-muted">Đang sử dụng</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start-warning">
                        <Card.Body className="text-center">
                            <h4 className="text-warning mb-1">
                                {courts.filter(c => c.status === 'maintenance').length}
                            </h4>
                            <div className="small text-muted">Bảo trì</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm border-start border-start-danger">
                        <Card.Body className="text-center">
                            <h4 className="text-danger mb-1">
                                {courts.filter(c => c.status === 'closed').length}
                            </h4>
                            <div className="small text-muted">Đóng cửa</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Courts Grid */}
            <Row>
                {courts.map(court => (
                    <Col lg={6} xl={4} key={court.id} className="mb-4">
                        <Card className="h-100 shadow-sm border-0">
                            <div
                                className="p-3"
                                style={{
                                    borderTop: `4px solid ${getStatusColor(court.status)}`,
                                    borderRadius: '8px 8px 0 0'
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="mb-1">Sân {court.courtNumber}</h5>
                                        <div className="small text-muted">{court.courtName}</div>
                                    </div>
                                    {getStatusBadge(court.status)}
                                </div>

                                {/* Current Booking */}
                                {court.currentBooking ? (
                                    <div className="bg-light p-2 rounded mb-3">
                                        <div className="small">
                                            <strong>Đang sử dụng:</strong>
                                            <div>{court.currentBooking.customerName}</div>
                                            <div className="text-muted">
                                                {court.currentBooking.startTime} - {court.currentBooking.endTime}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-light p-2 rounded mb-3 text-center small text-muted">
                                        Không có booking hiện tại
                                    </div>
                                )}

                                {/* Next Booking */}
                                {court.nextBooking && (
                                    <div className="small text-muted mb-3">
                                        <strong>Tiếp theo:</strong> {court.nextBooking.time} - {court.nextBooking.customerName}
                                    </div>
                                )}

                                {/* Maintenance Info */}
                                <div className="small text-muted mb-3">
                                    <div>Bảo trì lần cuối: {court.lastMaintenance}</div>
                                    {court.notes && (
                                        <div className="text-warning mt-1">
                                            <FiTool size={12} className="me-1" />
                                            {court.notes}
                                        </div>
                                    )}
                                </div>

                                {/* Status Control */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="small">Trạng thái:</Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={court.status}
                                        onChange={(e) => handleStatusChange(court.id, e.target.value)}
                                        disabled={court.currentBooking !== null}
                                    >
                                        <option value="available">Sẵn sàng</option>
                                        <option value="in_use">Đang sử dụng</option>
                                        <option value="maintenance">Bảo trì</option>
                                        <option value="closed">Đóng cửa</option>
                                    </Form.Select>
                                    {court.currentBooking && (
                                        <Form.Text className="text-muted">
                                            Không thể thay đổi khi có booking
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                {/* Actions */}
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => openMaintenanceModal(court)}
                                    >
                                        <FiTool className="me-2" />
                                        Bảo trì
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Maintenance Modal */}
            <Modal show={showMaintenanceModal} onHide={() => setShowMaintenanceModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FiTool className="me-2 text-warning" />
                        Lập Lịch Bảo Trì
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourt && (
                        <div>
                            <div className="mb-3">
                                <strong>Sân:</strong> Sân {selectedCourt.courtNumber} - {selectedCourt.courtName}
                            </div>
                            <Form.Group>
                                <Form.Label>Ghi chú bảo trì:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="VD: Thay lưới mới, sơn lại mặt sân..."
                                    value={maintenanceNotes}
                                    onChange={(e) => setMaintenanceNotes(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMaintenanceModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="warning" onClick={handleMaintenance}>
                        <FiTool className="me-2" />
                        Chuyển sang Bảo trì
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Courts;
