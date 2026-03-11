import React, { useState } from 'react';
import { Container, Card, Table, Button, Form, Badge } from 'react-bootstrap';
import { BiPlus, BiEdit, BiTrash } from 'react-icons/bi';
import { mockCancellationPolicies } from '../../../utils/mockAdminData';

const Policies = () => {
    const [policies, setPolicies] = useState(mockCancellationPolicies);
    const [editMode, setEditMode] = useState(false);

    const handleToggleActive = (id) => {
        setPolicies(policies.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        ));
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Chính sách hủy sân</h2>
                    <p className="text-muted">Cấu hình chính sách hoàn tiền khi khách hủy</p>
                </div>
                <Button variant="primary">
                    <BiPlus className="me-2" />
                    Thêm chính sách
                </Button>
            </div>

            {/* Policies Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Tên chính sách</th>
                                    <th>Mô tả</th>
                                    <th>Điều kiện (giờ trước)</th>
                                    <th>Hoàn tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map((policy) => (
                                    <tr key={policy.id}>
                                        <td className="align-middle">
                                            <strong>{policy.name}</strong>
                                        </td>
                                        <td className="align-middle">{policy.description}</td>
                                        <td className="align-middle">
                                            {policy.minHours > 0 ? `≥ ${policy.minHours}h` : 'Bất kỳ'}
                                            {policy.maxHours && ` - ${policy.maxHours}h`}
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={policy.refundPercent === 100 ? 'success' : policy.refundPercent === 0 ? 'danger' : 'warning'}>
                                                {policy.refundPercent}%
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <Form.Check
                                                type="switch"
                                                checked={policy.isActive}
                                                onChange={() => handleToggleActive(policy.id)}
                                                label={policy.isActive ? 'Đang áp dụng' : 'Tạm dừng'}
                                            />
                                        </td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="outline-primary" className="me-2">
                                                <BiEdit /> Sửa
                                            </Button>
                                            <Button size="sm" variant="outline-danger">
                                                <BiTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Policy Examples */}
            <Card className="border-0 shadow-sm mt-4">
                <Card.Header className="bg-white">
                    <h6 className="mb-0 fw-bold">Ví dụ áp dụng</h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-3">
                        <p className="mb-1"><strong>Hủy trước 25 giờ:</strong></p>
                        <p className="text-success mb-0">→ Hoàn 100% (Chính sách: Miễn phí hủy)</p>
                    </div>
                    <div className="mb-3">
                        <p className="mb-1"><strong>Hủy trước 10 giờ:</strong></p>
                        <p className="text-warning mb-0">→ Hoàn 50% (Chính sách: Hủy muộn)</p>
                    </div>
                    <div>
                        <p className="mb-1"><strong>Hủy sau giờ đặt:</strong></p>
                        <p className="text-danger mb-0">→ Không hoàn tiền (Chính sách: Hủy quá trễ)</p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Policies;
