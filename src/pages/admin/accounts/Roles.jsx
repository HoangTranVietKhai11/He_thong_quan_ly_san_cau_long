import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { BiSearch, BiPlus, BiEdit, BiTrash, BiShield } from 'react-icons/bi';

const defaultRoles = [
    {
        id: 1, key: 'admin', label: 'Admin', color: 'danger',
        desc: 'Quản trị viên hệ thống, toàn quyền truy cập',
        permissions: ['Quản lý tài khoản', 'Quản lý sân', 'Cấu hình giá', 'Xem tài chính', 'Xuất báo cáo'],
        userCount: 3
    },
    {
        id: 2, key: 'staff', label: 'Nhân viên', color: 'primary',
        desc: 'Nhân viên vận hành sân, hỗ trợ khách hàng',
        permissions: ['Xem sân', 'Quản lý đặt sân', 'Check-in/out', 'Quản lý kho'],
        userCount: 8
    },
    {
        id: 3, key: 'owner', label: 'Chủ sân', color: 'warning',
        desc: 'Chủ sân xem doanh thu và quản lý sân của mình',
        permissions: ['Xem sân', 'Xem đặt sân', 'Xem doanh thu'],
        userCount: 1
    },
    {
        id: 4, key: 'user', label: 'Khách hàng', color: 'info',
        desc: 'Khách hàng đăng ký và đặt sân trực tuyến',
        permissions: ['Đặt sân', 'Xem lịch sử', 'Cập nhật hồ sơ'],
        userCount: 156
    },
];

const Roles = () => {
    const [roles, setRoles] = useState(defaultRoles);
    const [selected, setSelected] = useState(defaultRoles[0]);
    const [toast, setToast] = useState('');
    const [search, setSearch] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const filtered = roles.filter(r =>
        r.label.toLowerCase().includes(search.toLowerCase()) ||
        r.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Quản lý Vai trò</h2>
                    <p className="text-muted mb-0">Xem thông tin phân quyền theo từng vai trò trong hệ thống</p>
                </div>
            </div>

            {toast && <Alert variant="success" onClose={() => setToast('')} dismissible>{toast}</Alert>}

            <Row className="mb-4 g-3">
                {roles.map((r, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm text-center" style={{ cursor: 'pointer', borderTop: `3px solid` }}
                            onClick={() => setSelected(r)}>
                            <Card.Body>
                                <Badge bg={r.color} className="mb-2">{r.label}</Badge>
                                <h4 className="fw-bold mb-0">{r.userCount}</h4>
                                <small className="text-muted">Người dùng</small>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Danh sách vai trò</Card.Header>
                        <Card.Body className="p-2">
                            <InputGroup className="mb-2">
                                <InputGroup.Text><BiSearch /></InputGroup.Text>
                                <Form.Control size="sm" placeholder="Tìm vai trò..." value={search} onChange={e => setSearch(e.target.value)} />
                            </InputGroup>
                            {filtered.map(role => (
                                <div key={role.id}
                                    className={`p-3 rounded mb-1 ${selected?.id === role.id ? 'bg-primary text-white' : 'bg-light'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelected(role)}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <Badge bg={role.color} className="me-2">{role.label}</Badge>
                                            <small className={selected?.id === role.id ? 'text-white-50' : 'text-muted'}>{role.userCount} người</small>
                                        </div>
                                        <BiShield />
                                    </div>
                                    <div className={`small mt-1 ${selected?.id === role.id ? 'text-white-50' : 'text-muted'}`}>{role.desc}</div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    {selected && (
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex align-items-center justify-content-between">
                                <span className="fw-bold">Chi tiết vai trò: <Badge bg={selected.color}>{selected.label}</Badge></span>
                            </Card.Header>
                            <Card.Body>
                                <p className="text-muted mb-4">{selected.desc}</p>

                                <h6 className="fw-bold mb-3">Quyền hạn được cấp ({selected.permissions.length})</h6>
                                <Row className="g-2 mb-4">
                                    {selected.permissions.map((p, i) => (
                                        <Col md={6} key={i}>
                                            <div className="d-flex align-items-center gap-2 p-2 bg-light rounded">
                                                <span className="text-success">✓</span>
                                                <span className="small">{p}</span>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                <Alert variant="info" className="small mb-0">
                                    ℹ️ Để thay đổi quyền chi tiết, vui lòng vào trang <strong>Phân quyền (ACL)</strong>.
                                </Alert>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Roles;
