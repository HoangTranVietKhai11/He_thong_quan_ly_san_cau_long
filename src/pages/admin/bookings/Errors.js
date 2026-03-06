import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { BiError, BiCheckCircle, BiSearch } from 'react-icons/bi';
import { mockBookingErrors } from '../../../utils/mockAdminData';

const Errors = () => {
    const [errors, setErrors] = useState(mockBookingErrors);

    const getErrorTypeBadge = (type) => {
        const types = {
            payment_failed: { label: 'Thanh toán thất bại', color: 'danger' },
            system_error: { label: 'Lỗi hệ thống', color: 'warning' },
            double_booking: { label: 'Đặt trùng', color: 'danger' },
            timeout: { label: 'Timeout', color: 'secondary' }
        };
        const info = types[type] || { label: type, color: 'dark' };
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
        setErrors(errors.map(e => 
            e.id === id ? {...e, status: 'resolved', resolution: 'Đã xử lý thủ công'} : e
        ));
        alert('Đã đánh dấu là đã giải quyết!');
    };

    const pendingCount = errors.filter(e => e.status === 'pending').length;
    const resolvedCount = errors.filter(e => e.status === 'resolved').length;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Xử lý booking lỗi</h2>
                <p className="text-muted">Theo dõi và khắc phục các lỗi trong quy trình đặt sân</p>
            </div>

            {pendingCount > 0 && (
                <Alert variant="danger" className="d-flex align-items-center">
                    <BiError size={24} className="me-3" />
                    <div>
                        <strong>Cảnh báo!</strong> Có {pendingCount} lỗi đang chờ xử lý
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
                            <BiSearch size={40} className="text-info mb-2" />
                            <div className="text-muted small">Đang điều tra</div>
                            <h3 className="fw-bold mb-0 text-info">
                                {errors.filter(e => e.status === 'investigating').length}
                            </h3>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Errors Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Loại lỗi</th>
                                    <th>Mã booking</th>
                                    <th>Khách hàng</th>
                                    <th>Mô tả</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Giải pháp</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((error) => (
                                    <tr key={error.id}>
                                        <td className="align-middle">#{error.id}</td>
                                        <td className="align-middle">{getErrorTypeBadge(error.errorType)}</td>
                                        <td className="align-middle">
                                            {error.bookingId ? <strong>{error.bookingId}</strong> : '-'}
                                        </td>
                                        <td className="align-middle">{error.userName || '-'}</td>
                                        <td className="align-middle">
                                            <small>{error.description}</small>
                                            {error.courtName && (
                                                <div className="text-muted small">Sân: {error.courtName}</div>
                                            )}
                                        </td>
                                        <td className="align-middle">
                                            <small>{error.occurredAt}</small>
                                        </td>
                                        <td className="align-middle">{getStatusBadge(error.status)}</td>
                                        <td className="align-middle">
                                            {error.resolution ? (
                                                <small className="text-success">{error.resolution}</small>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td className="align-middle">
                                            {error.status !== 'resolved' && (
                                                <Button 
                                                    size="sm" 
                                                    variant="outline-success"
                                                    onClick={() => handleResolve(error.id)}
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

export default Errors;
