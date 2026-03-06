import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Alert } from 'react-bootstrap';
import { BiShield, BiCheck, BiX } from 'react-icons/bi';

const roles = [
    { key: 'admin', label: 'Admin', color: 'danger', desc: 'Toàn quyền quản trị hệ thống' },
    { key: 'staff', label: 'Nhân viên', color: 'primary', desc: 'Vận hành sân và hỗ trợ khách hàng' },
    { key: 'owner', label: 'Chủ sân', color: 'warning', desc: 'Quản lý sân và doanh thu của mình' },
    { key: 'user', label: 'Khách hàng', color: 'info', desc: 'Đặt sân và sử dụng dịch vụ' },
];

const allPermissions = [
    { group: 'Tài khoản', items: ['Xem danh sách user', 'Thêm user', 'Sửa user', 'Xóa user', 'Khóa tài khoản'] },
    { group: 'Sân & Hạ tầng', items: ['Xem danh sách sân', 'Thêm sân', 'Sửa sân', 'Xóa sân', 'Cấu hình giá', 'Lịch bảo trì'] },
    { group: 'Đặt sân', items: ['Xem đặt sân', 'Tạo đặt sân', 'Hủy đặt sân', 'Check-in/out', 'Xem lịch sử'] },
    { group: 'Tài chính', items: ['Xem doanh thu', 'Xem thanh toán', 'Xuất báo cáo', 'Hoàn tiền'] },
    { group: 'Thiết bị', items: ['Xem tồn kho', 'Cập nhật tồn kho', 'Báo hỏng thiết bị'] },
];

// Default permission matrix
const defaultMatrix = {
    admin: { 'Xem danh sách user': true, 'Thêm user': true, 'Sửa user': true, 'Xóa user': true, 'Khóa tài khoản': true, 'Xem danh sách sân': true, 'Thêm sân': true, 'Sửa sân': true, 'Xóa sân': true, 'Cấu hình giá': true, 'Lịch bảo trì': true, 'Xem đặt sân': true, 'Tạo đặt sân': true, 'Hủy đặt sân': true, 'Check-in/out': true, 'Xem lịch sử': true, 'Xem doanh thu': true, 'Xem thanh toán': true, 'Xuất báo cáo': true, 'Hoàn tiền': true, 'Xem tồn kho': true, 'Cập nhật tồn kho': true, 'Báo hỏng thiết bị': true },
    staff: { 'Xem danh sách user': true, 'Thêm user': false, 'Sửa user': false, 'Xóa user': false, 'Khóa tài khoản': false, 'Xem danh sách sân': true, 'Thêm sân': false, 'Sửa sân': false, 'Xóa sân': false, 'Cấu hình giá': false, 'Lịch bảo trì': false, 'Xem đặt sân': true, 'Tạo đặt sân': true, 'Hủy đặt sân': true, 'Check-in/out': true, 'Xem lịch sử': true, 'Xem doanh thu': false, 'Xem thanh toán': true, 'Xuất báo cáo': false, 'Hoàn tiền': false, 'Xem tồn kho': true, 'Cập nhật tồn kho': true, 'Báo hỏng thiết bị': true },
    owner: { 'Xem danh sách user': false, 'Thêm user': false, 'Sửa user': false, 'Xóa user': false, 'Khóa tài khoản': false, 'Xem danh sách sân': true, 'Thêm sân': false, 'Sửa sân': true, 'Xóa sân': false, 'Cấu hình giá': false, 'Lịch bảo trì': false, 'Xem đặt sân': true, 'Tạo đặt sân': false, 'Hủy đặt sân': false, 'Check-in/out': false, 'Xem lịch sử': true, 'Xem doanh thu': true, 'Xem thanh toán': true, 'Xuất báo cáo': true, 'Hoàn tiền': false, 'Xem tồn kho': false, 'Cập nhật tồn kho': false, 'Báo hỏng thiết bị': false },
    user: { 'Xem danh sách user': false, 'Thêm user': false, 'Sửa user': false, 'Xóa user': false, 'Khóa tài khoản': false, 'Xem danh sách sân': true, 'Thêm sân': false, 'Sửa sân': false, 'Xóa sân': false, 'Cấu hình giá': false, 'Lịch bảo trì': false, 'Xem đặt sân': true, 'Tạo đặt sân': true, 'Hủy đặt sân': true, 'Check-in/out': false, 'Xem lịch sử': true, 'Xem doanh thu': false, 'Xem thanh toán': false, 'Xuất báo cáo': false, 'Hoàn tiền': false, 'Xem tồn kho': false, 'Cập nhật tồn kho': false, 'Báo hỏng thiết bị': false },
};

const Permissions = () => {
    const [activeRole, setActiveRole] = useState('admin');
    const [matrix, setMatrix] = useState(defaultMatrix);
    const [saved, setSaved] = useState(false);

    const toggle = (perm) => {
        if (activeRole === 'admin') return; // Admin luôn full quyền
        setMatrix(prev => ({
            ...prev,
            [activeRole]: { ...prev[activeRole], [perm]: !prev[activeRole][perm] }
        }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const current = matrix[activeRole];

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Phân quyền (ACL)</h2>
                    <p className="text-muted mb-0">Cấu hình quyền truy cập theo từng vai trò người dùng</p>
                </div>
                <Button variant="primary" onClick={handleSave} disabled={activeRole === 'admin'}>
                    <BiShield className="me-2" />Lưu phân quyền
                </Button>
            </div>

            {saved && <Alert variant="success" className="mb-3">✅ Đã lưu cấu hình phân quyền thành công!</Alert>}
            {activeRole === 'admin' && <Alert variant="info" className="mb-3">ℹ️ Admin luôn có toàn quyền, không thể chỉnh sửa.</Alert>}

            <Row>
                <Col md={3}>
                    <Card className="border-0 shadow-sm mb-3">
                        <Card.Header className="bg-white fw-bold">Chọn vai trò</Card.Header>
                        <Card.Body className="p-2">
                            {roles.map(role => (
                                <div
                                    key={role.key}
                                    className={`p-3 rounded mb-1 cursor-pointer ${activeRole === role.key ? 'bg-primary text-white' : 'bg-light'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setActiveRole(role.key)}
                                >
                                    <div className="fw-bold">
                                        <Badge bg={role.color} className="me-2">{role.label}</Badge>
                                    </div>
                                    <small className={activeRole === role.key ? 'text-white-50' : 'text-muted'}>{role.desc}</small>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={9}>
                    {allPermissions.map(group => (
                        <Card key={group.group} className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">{group.group}</Card.Header>
                            <Card.Body className="p-0">
                                <Table className="mb-0">
                                    <tbody>
                                        {group.items.map(perm => (
                                            <tr key={perm}>
                                                <td className="align-middle ps-3">{perm}</td>
                                                <td className="text-end pe-3">
                                                    <Form.Check
                                                        type="switch"
                                                        checked={current[perm] || false}
                                                        onChange={() => toggle(perm)}
                                                        disabled={activeRole === 'admin'}
                                                        label={
                                                            current[perm]
                                                                ? <Badge bg="success"><BiCheck /> Cho phép</Badge>
                                                                : <Badge bg="secondary"><BiX /> Từ chối</Badge>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default Permissions;
