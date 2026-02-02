import React, { useState } from 'react';
import { Container, Card, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import { BiWrench, BiCalendar, BiDollar } from 'react-icons/bi';
import { mockRepairHistory } from '../../../utils/mockAdminData';

const RepairHistory = () => {
    const [repairs, setRepairs] = useState(mockRepairHistory);
    const [filterSeverity, setFilterSeverity] = useState('all');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getSeverityBadge = (severity) => {
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
            critical: 'Nghiêm trọng'
        };
        return <Badge bg={variants[severity]}>{labels[severity]}</Badge>;
    };

    const filteredRepairs = filterSeverity === 'all'
        ? repairs
        : repairs.filter(r => r.severity === filterSeverity);

    const totalCost = repairs.reduce((sum, r) => sum + r.cost, 0);
    const avgCost = totalCost / repairs.length;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Lịch sử sửa chữa</h2>
                <p className="text-muted">Theo dõi lịch sử bảo trì và sửa chữa sân</p>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiWrench size={30} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng sửa chữa</div>
                            <h3 className="fw-bold mb-0">{repairs.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiDollar size={30} className="text-success mb-2" />
                            <div className="text-muted small">Tổng chi phí</div>
                            <h4 className="fw-bold mb-0 text-danger">{formatPrice(totalCost)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCalendar size={30} className="text-info mb-2" />
                            <div className="text-muted small">Chi phí TB</div>
                            <h4 className="fw-bold mb-0 text-primary">{formatPrice(avgCost)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Nghiêm trọng</div>
                            <h3 className="fw-bold mb-0 text-danger">
                                {repairs.filter(r => r.severity === 'critical' || r.severity === 'high').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Form.Group as={Row} className="mb-0">
                        <Form.Label column sm={2}>Lọc theo mức độ:</Form.Label>
                        <Col sm={4}>
                            <Form.Select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                                <option value="all">Tất cả</option>
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                                <option value="critical">Nghiêm trọng</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>

            {/* Repair History Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Sân</th>
                                    <th>Loại vấn đề</th>
                                    <th>Mô tả</th>
                                    <th>Báo cáo</th>
                                    <th>Sửa xong</th>
                                    <th>Downtime</th>
                                    <th>Người sửa</th>
                                    <th>Chi phí</th>
                                    <th>Mức độ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRepairs.map((repair) => (
                                    <tr key={repair.id}>
                                        <td className="align-middle">
                                            <strong>{repair.courtName}</strong>
                                        </td>
                                        <td className="align-middle">{repair.issueType}</td>
                                        <td className="align-middle">
                                            <small>{repair.description}</small>
                                        </td>
                                        <td className="align-middle">{formatDate(repair.reportedDate)}</td>
                                        <td className="align-middle">{formatDate(repair.repairedDate)}</td>
                                        <td className="align-middle">
                                            <Badge bg="secondary">{repair.downtime}</Badge>
                                        </td>
                                        <td className="align-middle">{repair.repairedBy}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(repair.cost)}</strong>
                                        </td>
                                        <td className="align-middle">{getSeverityBadge(repair.severity)}</td>
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

export default RepairHistory;
