import React from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { mockBookings } from '../../utils/mockData';

const Bookings = () => {
    const ownerBookings = mockBookings.slice(0, 4);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
        return <Badge bg={variants[status]}>{labels[status]}</Badge>;
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Quản lý đặt sân</h2>

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
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Bookings;
