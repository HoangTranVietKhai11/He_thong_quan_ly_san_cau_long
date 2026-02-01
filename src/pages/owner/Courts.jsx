import React from 'react';
import { Container, Card, Button, Table, Badge } from 'react-bootstrap';
import { BiPlus } from 'react-icons/bi';
import { mockCourts } from '../../utils/mockData';

const Courts = () => {
    const ownerCourts = mockCourts.slice(0, 2); // Owner's courts

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý sân</h2>
                <Button variant="primary">
                    <BiPlus size={20} className="me-2" />
                    Thêm sân mới
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Tên sân</th>
                                <th>Địa chỉ</th>
                                <th>Số sân</th>
                                <th>Giá/giờ</th>
                                <th>Đánh giá</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ownerCourts.map(court => (
                                <tr key={court.id}>
                                    <td className="fw-bold">{court.name}</td>
                                    <td>{court.address}</td>
                                    <td>{court.totalCourts}</td>
                                    <td>{formatPrice(court.pricePerHour)}</td>
                                    <td>
                                        <Badge bg="warning" text="dark">
                                            ⭐ {court.rating}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg="success">Hoạt động</Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm">
                                                Sửa
                                            </Button>
                                            <Button variant="outline-danger" size="sm">
                                                Xóa
                                            </Button>
                                        </div>
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
