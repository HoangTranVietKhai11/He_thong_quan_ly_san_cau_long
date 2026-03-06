import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { BiError, BiCheckCircle } from 'react-icons/bi';
import { mockBookingConflicts } from '../../../utils/mockAdminData';

const Conflicts = () => {
    const [conflicts, setConflicts] = useState(mockBookingConflicts);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getConflictTypeBadge = (type) => {
        const types = {
            double_booking: { label: 'Đặt trùng', color: 'danger' },
            maintenance_overlap: { label: 'Trùng bảo trì', color: 'warning' },
            system_error: { label: 'Lỗi hệ thống', color: 'dark' }
        };
        const info = types[type] || { label: type, color: 'secondary' };
        return <Badge bg={info.color}>{info.label}</Badge>;
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            resolved: 'success',
            investigating: 'info'
        };
        const labels = {
            pending: 'Chờ xử lý',
            resolved: 'Đã giải quyết',
            investigating: 'Đang điều tra'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    const handleResolve = (id) => {
        setConflicts(conflicts.map(c =>
            c.id === id ? { ...c, status: 'resolved' } : c
        ));
    };

    const pendingCount = conflicts.filter(c => c.status === 'pending').length;
    const resolvedCount = conflicts.filter(c => c.status === 'resolved').length;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Xử lý trùng lịch</h2>
                <p className="text-muted">Phát hiện và xử lý các xung đột đặt sân</p>
            </div>

            {pendingCount > 0 && (
                <Alert variant="danger" className="d-flex align-items-center">
                    <BiError size={24} className="me-3" />
                    <div>
                        <strong>Cảnh báo!</strong> Có {pendingCount} xung đột đang chờ xử lý
                    </div>
                </Alert>
            )}

            {/* Statistics */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiError size={40} className="text-danger mb-2" />
                            <div className="text-muted small">Chờ xử lý</div>
                            <h3 className="fw-bold mb-0 text-danger">{pendingCount}</h3>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCheckCircle size={40} className="text-success mb-2" />
                            <div className="text-muted small">Đã giải quyết</div>
                            <h3 className="fw-bold mb-0 text-success">{resolvedCount}</h3>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tổng xung đột</div>
                            <h3 className="fw-bold mb-0">{conflicts.length}</h3>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Conflicts Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Sân</th>
                                    <th>Ngày</th>
                                    <th>Giờ</th>
                                    <th>Loại xung đột</th>
                                    <th>Chi tiết</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conflicts.map((conflict) => (
                                    <tr key={conflict.id}>
                                        <td className="align-middle">#{conflict.id}</td>
                                        <td className="align-middle"><strong>{conflict.courtName}</strong></td>
                                        <td className="align-middle">{formatDate(conflict.date)}</td>
                                        <td className="align-middle">{conflict.timeSlot}</td>
                                        <td className="align-middle">{getConflictTypeBadge(conflict.conflictType)}</td>
                                        <td className="align-middle">
                                            {conflict.bookings && (
                                                <small>
                                                    {conflict.bookings.map(b => b.userName).join(', ')}
                                                </small>
                                            )}
                                            {conflict.description && <small>{conflict.description}</small>}
                                            {conflict.resolution && (
                                                <div className="text-success small mt-1">
                                                    Giải pháp: {conflict.resolution}
                                                </div>
                                            )}
                                        </td>
                                        <td className="align-middle">{getStatusBadge(conflict.status)}</td>
                                        <td className="align-middle">
                                            {conflict.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => handleResolve(conflict.id)}
                                                >
                                                    Giải quyết
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

export default Conflicts;
