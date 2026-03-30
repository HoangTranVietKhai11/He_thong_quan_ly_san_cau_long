import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { BiWrench, BiPlus, BiCheck, BiX, BiRefresh, BiTimeFive } from 'react-icons/bi';
import staffOpsService from '../../services/staffOpsService';
import courtService from '../../services/courtService';

const RepairSchedule = () => {
    const [repairs, setRepairs] = useState([]);
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        court_id: '',
        issue: '',
        urgency: 'medium',
        scheduled_date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [logsRes, courtsRes] = await Promise.all([
                staffOpsService.getMaintenanceLogs(),
                courtService.getCourts({ limit: 100 })
            ]);
            setRepairs(logsRes.data || []);
            setCourts(courtsRes.data.courts || courtsRes.data.data || []);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu bảo trì. Vui lòng kiểm tra kết nối.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        const variants = {
            'Pending': 'warning',
            'In Progress': 'primary',
            'Completed': 'success'
        };
        const labels = {
            'Pending': 'Chờ xử lý',
            'In Progress': 'Đang sửa',
            'Completed': 'Hoàn thành'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await staffOpsService.addMaintenanceLog(formData);
            setShowModal(false);
            setFormData({
                court_id: '',
                issue: '',
                urgency: 'medium',
                scheduled_date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (err) {
            alert('Lỗi khi thêm lịch bảo trì');
        }
    };

    const updateStatus = async (id, status, action = '') => {
        try {
            await staffOpsService.updateMaintenanceStatus(id, {
                status,
                action_taken: action || (status === 'Completed' ? 'Đã sửa chữa xong' : 'Bắt đầu sửa chữa'),
                cost: 0 // Có thể bổ sung input cost sau
            });
            fetchData();
        } catch (err) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    if (loading && repairs.length === 0) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải dữ liệu sửa chữa...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2"><BiWrench className="me-2" />Lịch bảo trì & Sửa chữa</h2>
                    <p className="text-muted mb-0">Quản lý tình trạng sân và ghi nhận sự cố hỏng hóc</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={fetchData}><BiRefresh className="me-1" /> Làm mới</Button>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        <BiPlus size={20} className="me-2" />
                        Báo cáo sự cố
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Statistics */}
            <Row className="mb-4">
                {[
                    { label: 'Chờ xử lý', value: repairs.filter(r => r.status === 'Pending').length, color: 'warning' },
                    { label: 'Đang sửa', value: repairs.filter(r => r.status === 'In Progress').length, color: 'primary' },
                    { label: 'Đã hoàn thành', value: repairs.filter(r => r.status === 'Completed').length, color: 'success' },
                    { label: 'Tổng số lượt', value: repairs.length, color: 'info' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className={`border-0 shadow-sm border-start border-${s.color} border-4`}>
                            <Card.Body>
                                <div className="text-muted small">{s.label}</div>
                                <h3 className={`mb-0 fw-bold text-${s.color}`}>{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Repairs Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="bg-light text-muted small text-uppercase">
                            <tr>
                                <th className="px-4 py-3">Sân</th>
                                <th className="py-3">Sự cố / Nội dung</th>
                                <th className="py-3">Ngày bắt đầu</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3">Hành động xử lý</th>
                                <th className="py-3 text-end px-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairs.map((repair) => (
                                <tr key={repair.id}>
                                    <td className="px-4 align-middle">
                                        <div className="fw-bold">{repair.court_name}</div>
                                        <small className="text-muted">ID: {repair.court_id}</small>
                                    </td>
                                    <td className="align-middle">
                                        <div className="fw-medium">{repair.issue}</div>
                                    </td>
                                    <td className="align-middle text-muted">
                                        <BiTimeFive size={14} className="me-1" />
                                        {new Date(repair.scheduled_date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="align-middle">
                                        {getStatusBadge(repair.status)}
                                    </td>
                                    <td className="align-middle small text-muted">
                                        {repair.action_taken || '---'}
                                    </td>
                                    <td className="text-end px-4 align-middle">
                                        {repair.status === 'Pending' && (
                                            <Button size="sm" variant="info" className="text-white" onClick={() => updateStatus(repair.id, 'In Progress')}>
                                                Tiếp nhận
                                            </Button>
                                        )}
                                        {repair.status === 'In Progress' && (
                                            <Button size="sm" variant="success" onClick={() => updateStatus(repair.id, 'Completed')}>
                                                <BiCheck size={16} /> Hoàn tất
                                            </Button>
                                        )}
                                        {repair.status === 'Completed' && (
                                            <Badge bg="light" text="success" className="p-2 border border-success">
                                                ✓ Đã sửa
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {repairs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Không có lịch sử bảo trì nào</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add Repair Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title><BiWrench className="me-2" />Báo cáo sự cố sân</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn sân gặp sự cố <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.court_id}
                                onChange={(e) => setFormData({ ...formData, court_id: e.target.value })}
                                required
                            >
                                <option value="">-- Chọn sân --</option>
                                {courts.map(court => (
                                    <option key={court.id} value={court.id}>{court.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả sự cố <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ghi rõ tình trạng: Vd: Lưới rách, đèn sân cháy..."
                                value={formData.issue}
                                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày dự kiến bảo trì</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={formData.scheduled_date}
                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="primary" type="submit">
                            Ghi nhận & Đưa vào bảo trì
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default RepairSchedule;
