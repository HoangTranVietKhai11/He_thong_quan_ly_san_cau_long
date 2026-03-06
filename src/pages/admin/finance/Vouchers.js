import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { BiGift, BiPlus, BiEdit } from 'react-icons/bi';
import { mockVouchers } from '../../../utils/mockAdminData';

const Vouchers = () => {
    const [vouchers, setVouchers] = useState(mockVouchers);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter(v => v.isActive).length;
    const totalUsed = vouchers.reduce((sum, v) => sum + v.used, 0);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Quản lý voucher</h2>
                    <p className="text-muted">Tạo và quản lý mã giảm giá</p>
                </div>
                <Button variant="primary">
                    <BiPlus className="me-2" />
                    Tạo voucher mới
                </Button>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <BiGift size={40} className="text-primary mb-2" />
                            <div className="text-muted small">Tổng vouchers</div>
                            <h3 className="fw-bold mb-0">{totalVouchers}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Đang hoạt động</div>
                            <h3 className="fw-bold mb-0 text-success">{activeVouchers}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Đã sử dụng</div>
                            <h3 className="fw-bold mb-0 text-info">{totalUsed}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="text-muted small mb-1">Tỷ lệ dùng TB</div>
                            <h3 className="fw-bold mb-0 text-warning">
                                {Math.round((totalUsed / vouchers.reduce((sum, v) => sum + v.quantity, 0)) * 100)}%
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Vouchers Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên voucher</th>
                                    <th>Loại</th>
                                    <th>Giá trị</th>
                                    <th>Đơn tối thiểu</th>
                                    <th>Số lượng</th>
                                    <th>Đã dùng</th>
                                    <th>Hiệu lực</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map((voucher) => {
                                    const usagePercent = (voucher.used / voucher.quantity) * 100;
                                    return (
                                        <tr key={voucher.id}>
                                            <td className="align-middle">
                                                <Badge bg="dark">{voucher.code}</Badge>
                                            </td>
                                            <td className="align-middle"><strong>{voucher.name}</strong></td>
                                            <td className="align-middle">
                                                <Badge bg={voucher.type === 'percent' ? 'info' : 'warning'}>
                                                    {voucher.type === 'percent' ? 'Phần trăm' : 'Cố định'}
                                                </Badge>
                                            </td>
                                            <td className="align-middle">
                                                <strong className="text-primary">
                                                    {voucher.type === 'percent' ? `${voucher.value}%` : formatPrice(voucher.value)}
                                                </strong>
                                            </td>
                                            <td className="align-middle">{formatPrice(voucher.minOrder)}</td>
                                            <td className="align-middle">{voucher.quantity}</td>
                                            <td className="align-middle">
                                                <div>{voucher.used}</div>
                                                <ProgressBar
                                                    now={usagePercent}
                                                    variant={usagePercent > 80 ? 'danger' : 'success'}
                                                    style={{ height: '5px' }}
                                                />
                                            </td>
                                            <td className="align-middle">
                                                <small>
                                                    {formatDate(voucher.validFrom)} - {formatDate(voucher.validTo)}
                                                </small>
                                            </td>
                                            <td className="align-middle">
                                                <Badge bg={voucher.isActive ? 'success' : 'secondary'}>
                                                    {voucher.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                </Badge>
                                            </td>
                                            <td className="align-middle">
                                                <Button size="sm" variant="outline-primary">
                                                    <BiEdit /> Sửa
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Vouchers;
