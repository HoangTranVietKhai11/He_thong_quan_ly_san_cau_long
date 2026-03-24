import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';
import ownerService from '../../services/ownerService';

const Bookings = () => {
    const [ownerBookings, setOwnerBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await ownerService.getBookings();
                setOwnerBookings(Array.isArray(res.data) ? res.data : res.data?.bookings || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'success',
            pending: 'warning',
            completed: 'info',
            cancelled: 'danger'
        };
        const labels = {
            confirmed: 'Đã xác nhận',
            pending: 'Chờ xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Quản lý đặt sân</h2>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày</th>
                                    <th>Giờ</th>
                                    <th>Sân</th>
                                    <th>Giá</th>
                                    <th>Trạng thái</th>
                                    <th>Thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ownerBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td>#{booking.id}</td>
                                        <td>{booking.userName}</td>
                                        <td>{new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                                        <td>{booking.startTime} - {booking.endTime}</td>
                                        <td>Sân {booking.courtNumber}</td>
                                        <td className="fw-bold">{formatPrice(booking.totalPrice)}</td>
                                        <td>{getStatusBadge(booking.status)}</td>
                                        <td>
                                            {booking.paymentStatus === 'paid' ? (
                                                <Badge bg="success">Đã TT</Badge>
                                            ) : (
                                                <Badge bg="warning">Chưa TT</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {ownerBookings.length === 0 && (
                            <div className="text-center py-4 text-muted">Không có dữ liệu đặt sân</div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Bookings;
