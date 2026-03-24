import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { BiError, BiCalendarX, BiRefresh, BiCheckCircle } from 'react-icons/bi';
import adminStatsService from '../../../services/adminStatsService';

const Conflicts = () => {
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadConflicts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await adminStatsService.getConflicts();
            setConflicts(res.data?.data || []);
        } catch (err) {
            setError('Không thể tải danh sách xung đột: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadConflicts(); }, []);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        <BiError className="me-2 text-warning" />Xung đột lịch đặt sân
                    </h2>
                    <p className="text-muted mb-0">Phát hiện và xử lý các ca đặt sân bị chồng lấn thời gian</p>
                </div>
                <Button variant="outline-primary" onClick={loadConflicts} disabled={loading}>
                    <BiRefresh className="me-1" /> Làm mới
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <BiCalendarX size={36} className="text-danger mb-2" />
                            <h3 className="fw-bold text-danger">{conflicts.length}</h3>
                            <div className="text-muted small">Tổng xung đột phát hiện</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <BiCheckCircle size={36} className="text-success mb-2" />
                            <h3 className="fw-bold text-success">
                                {conflicts.length === 0 ? '✓ Không có' : conflicts.length}
                            </h3>
                            <div className="text-muted small">Trạng thái hệ thống</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Sân xung đột nhiều nhất</div>
                            <h5 className="fw-bold">
                                {conflicts.length > 0
                                    ? (() => {
                                        const courtCount = {};
                                        conflicts.forEach(c => { courtCount[c.court_name] = (courtCount[c.court_name] || 0) + 1; });
                                        return Object.entries(courtCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
                                    })()
                                    : '—'}
                            </h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
                    ) : conflicts.length === 0 ? (
                        <div className="text-center py-5">
                            <BiCheckCircle size={50} className="text-success mb-3" />
                            <h5 className="text-success">Tuyệt vời! Không có xung đột nào được phát hiện</h5>
                            <p className="text-muted">Tất cả lịch đặt sân đang hoạt động bình thường.</p>
                        </div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="bg-warning bg-opacity-10">
                                <tr>
                                    <th className="ps-4">Sân</th>
                                    <th>Ngày</th>
                                    <th>Đặt sân #1</th>
                                    <th>Đặt sân #2</th>
                                    <th>Khách hàng</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conflicts.map((c, i) => (
                                    <tr key={i} className="border-bottom">
                                        <td className="ps-4 align-middle fw-bold">{c.court_name}</td>
                                        <td className="align-middle">{formatDate(c.booking_date)}</td>
                                        <td className="align-middle">
                                            <code className="text-danger small">#{c.booking1_id}: {c.booking1_start} - {c.booking1_end}</code>
                                        </td>
                                        <td className="align-middle">
                                            <code className="text-warning small">#{c.booking2_id}: {c.booking2_start} - {c.booking2_end}</code>
                                        </td>
                                        <td className="align-middle">
                                            <div className="small"><strong>{c.user1}</strong></div>
                                            <div className="small text-muted">{c.user2}</div>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg="danger">Xung đột</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Conflicts;
