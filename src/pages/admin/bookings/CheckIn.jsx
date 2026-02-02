import React, { useState } from 'react';
import { Container, Card, Table, Button, Badge, InputGroup, Form, Row, Col } from 'react-bootstrap';
import { BiSearch, BiCalendar, BiLogIn, BiLogOut } from 'react-icons/bi';
import { mockCheckIns } from '../../../utils/mockAdminData';

const CheckIn = () => {
    const [checkIns, setCheckIns] = useState(mockCheckIns);
    const [searchTerm, setSearchTerm] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const variants = {
            checked_in: 'info',
            checked_out: 'success',
            no_show: 'danger'
        };
        const labels = {
            checked_in: 'Đã check-in',
            checked_out: 'Đãcheck-out',
            no_show: 'Không đến'
        };
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    const handleCheckOut = (id) => {
        const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setCheckIns(checkIns.map(c =>
            c.id === id ? { ...c, status: 'checked_out', checkOutTime: currentTime } : c
        ));
        alert('Đã check-out thành công!');
    };

    const filteredCheckIns = searchTerm
        ? checkIns.filter(c => c.userName.toLowerCase().includes(searchTerm.toLowerCase()) || c.bookingId.includes(searchTerm))
        : checkIns;

    const checkedInCount = checkIns.filter(c => c.status === 'checked_in').length;
    const checkedOutCount = checkIns.filter(c => c.status === 'checked_out').length;

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Quản lý Check-in/Check-out</h2>
                <p className="text-muted">Theo dõi và xử lý việc check-in/check-out của khách</p>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiLogIn size={40} className="text-info mb-2" />
                            <div className="text-muted small">Đã check-in</div>
                            <h3 className="fw-bold mb-0 text-info">{checkedInCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiLogOut size={40} className="text-success mb-2" />
                            <div className="text-muted small">Đã check-out</div>
                            <h3 className="fw-bold mb-0 text-success">{checkedOutCount}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiCalendar size={40} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng</div>
                            <h3 className="fw-bold mb-0">{checkIns.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text><BiSearch /></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm theo tên khách hoặc mã booking"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Check-in Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã booking</th>
                                    <th>Khách hàng</th>
                                    <th>Sân</th>
                                    <th>Ngày</th>
                                    <th>Giờ đặt</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Quá giờ</th>
                                    <th>Trạng thái</th>
                                    <th>Nhân viên</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCheckIns.map((checkIn) => (
                                    <tr key={checkIn.id}>
                                        <td className="align-middle">
                                            <strong>{checkIn.bookingId}</strong>
                                        </td>
                                        <td className="align-middle">{checkIn.userName}</td>
                                        <td className="align-middle">{checkIn.courtName}</td>
                                        <td className="align-middle">{formatDate(checkIn.date)}</td>
                                        <td className="align-middle">{checkIn.timeSlot}</td>
                                        <td className="align-middle">
                                            {checkIn.checkInTime ? (
                                                <Badge bg="info">{checkIn.checkInTime}</Badge>
                                            ) : '-'}
                                        </td>
                                        <td className="align-middle">
                                            {checkIn.checkOutTime ? (
                                                <Badge bg="success">{checkIn.checkOutTime}</Badge>
                                            ) : '-'}
                                        </td>
                                        <td className="align-middle">
                                            {checkIn.overtime ? (
                                                <div>
                                                    <Badge bg="warning">{checkIn.overtime} phút</Badge>
                                                    <div className="text-danger small mt-1">
                                                        +{formatPrice(checkIn.overtimeFee)}
                                                    </div>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="align-middle">{getStatusBadge(checkIn.status)}</td>
                                        <td className="align-middle">
                                            <small>{checkIn.staffName}</small>
                                        </td>
                                        <td className="align-middle">
                                            {checkIn.status === 'checked_in' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => handleCheckOut(checkIn.id)}
                                                >
                                                    Check-out
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

export default CheckIn;
