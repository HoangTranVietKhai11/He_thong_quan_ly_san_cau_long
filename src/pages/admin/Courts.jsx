import React from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { mockCourts } from '../../utils/mockData';

const Courts = () => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <h2 className="fw-bold mb-4">Quản lý sân</h2>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sân</th>
                                <th>Chủ sân</th>
                                <th>Địa chỉ</th>
                                <th>Số sân</th>
                                <th>Giá/giờ</th>
                                <th>Đánh giá</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockCourts.map(court => (
                                <tr key={court.id}>
                                    <td>#{court.id}</td>
                                    <td className="fw-bold">{court.name}</td>
                                    <td>{court.owner}</td>
                                    <td>{court.address}</td>
                                    <td>{court.totalCourts}</td>
                                    <td>{formatPrice(court.pricePerHour)}</td>
                                    <td>
                                        <Badge bg="warning" text="dark">
                                            ⭐ {court.rating} ({court.totalReviews})
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg="success">Hoạt động</Badge>
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

export default Courts;
