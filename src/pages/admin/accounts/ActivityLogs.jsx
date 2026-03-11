import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { BiSearch, BiUser, BiShield, BiDesktop, BiDownload } from 'react-icons/bi';

const generateActivityLogs = () => {
    const actors = [
        { name: 'Trần Minh Quân', role: 'admin', email: 'admin1@badminton.vn' },
        { name: 'Nguyễn Thị Lan', role: 'admin', email: 'admin2@badminton.vn' },
        { name: 'Phạm Văn Staff', role: 'staff', email: 'staff@badminton.vn' },
        { name: 'Lê Thị User', role: 'user', email: 'user@example.com' },
    ];
    const activities = [
        { action: 'Đăng nhập thành công', type: 'auth', result: 'success' },
        { action: 'Đăng xuất', type: 'auth', result: 'success' },
        { action: 'Cập nhật hồ sơ', type: 'account', result: 'success' },
        { action: 'Đổi mật khẩu', type: 'security', result: 'success' },
        { action: 'Đăng nhập thất bại', type: 'auth', result: 'failed' },
        { action: 'Thêm đặt sân', type: 'booking', result: 'success' },
        { action: 'Hủy đặt sân', type: 'booking', result: 'success' },
        { action: 'Thêm sân mới', type: 'court', result: 'success' },
        { action: 'Cấu hình giá', type: 'court', result: 'success' },
        { action: 'Xuất báo cáo', type: 'report', result: 'success' },
    ];
    const devices = ['Chrome - Windows', 'Safari - macOS', 'Firefox - Linux', 'Chrome - Android'];
    const ips = ['192.168.1.100', '192.168.1.101', '10.0.0.5', '203.113.142.80'];
    const logs = [];
    for (let i = 0; i < 40; i++) {
        const d = new Date('2026-03-03T21:00:00');
        d.setMinutes(d.getMinutes() - i * 45);
        const actor = actors[i % actors.length];
        const activity = activities[i % activities.length];
        logs.push({
            id: i + 1,
            time: d.toLocaleString('vi-VN'),
            name: actor.name,
            email: actor.email,
            role: actor.role,
            action: activity.action,
            type: activity.type,
            result: activity.result,
            device: devices[i % devices.length],
            ip: ips[i % ips.length],
        });
    }
    return logs;
};

const allLogs = generateActivityLogs();
const typeLabels = { auth: 'Xác thực', account: 'Tài khoản', security: 'Bảo mật', booking: 'Đặt sân', court: 'Sân', report: 'Báo cáo' };
const typeColors = { auth: 'primary', account: 'info', security: 'warning', booking: 'success', court: 'secondary', report: 'dark' };
const roleColors = { admin: 'danger', staff: 'primary', owner: 'warning', user: 'info' };

const ActivityLogs = () => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [page, setPage] = useState(1);
    const perPage = 10;

    const filtered = allLogs.filter(l => {
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.email.includes(search) || l.action.includes(search);
        const matchType = filterType === 'all' || l.type === filterType;
        const matchRole = filterRole === 'all' || l.role === filterRole;
        return matchSearch && matchType && matchRole;
    });

    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Lịch sử hoạt động</h2>
                    <p className="text-muted mb-0">Theo dõi mọi thao tác của người dùng trong hệ thống</p>
                </div>
                <Button variant="outline-primary">
                    <BiDownload className="me-1" />Xuất CSV
                </Button>
            </div>

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng hoạt động', value: allLogs.length, icon: <BiDesktop />, color: 'primary' },
                    { label: 'Bởi Admin', value: allLogs.filter(l => l.role === 'admin').length, icon: <BiShield />, color: 'danger' },
                    { label: 'Bởi Staff', value: allLogs.filter(l => l.role === 'staff').length, icon: <BiUser />, color: 'info' },
                    { label: 'Thất bại', value: allLogs.filter(l => l.result === 'failed').length, icon: <BiUser />, color: 'warning' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <div className={`text-${s.color} mb-1`}>{s.icon}</div>
                                <div className="small text-muted">{s.label}</div>
                                <h4 className="fw-bold mb-0">{s.value}</h4>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Row className="g-2">
                        <Col md={5}>
                            <InputGroup>
                                <InputGroup.Text><BiSearch /></InputGroup.Text>
                                <Form.Control placeholder="Tìm tên, email, hành động..." value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }} />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            <Form.Select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
                                <option value="all">Tất cả loại</option>
                                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}>
                                <option value="all">Tất cả vai trò</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Nhân viên</option>
                                <option value="owner">Chủ sân</option>
                                <option value="user">Khách hàng</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0 small">
                            <thead className="bg-light">
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Người dùng</th>
                                    <th>Hành động</th>
                                    <th>Loại</th>
                                    <th>Thiết bị / IP</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(log => (
                                    <tr key={log.id}>
                                        <td className="align-middle text-muted">{log.time}</td>
                                        <td className="align-middle">
                                            <div className="fw-bold">{log.name}</div>
                                            <div className="text-muted">{log.email}</div>
                                            <Badge bg={roleColors[log.role]} className="mt-1" style={{ fontSize: '0.65rem' }}>
                                                {log.role}
                                            </Badge>
                                        </td>
                                        <td className="align-middle fw-bold">{log.action}</td>
                                        <td className="align-middle">
                                            <Badge bg={typeColors[log.type]}>{typeLabels[log.type]}</Badge>
                                        </td>
                                        <td className="align-middle text-muted">
                                            <div>{log.device}</div>
                                            <div>{log.ip}</div>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={log.result === 'success' ? 'success' : 'danger'}>
                                                {log.result === 'success' ? 'Thành công' : 'Thất bại'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Hiển thị {paginated.length}/{filtered.length} hoạt động</small>
                    <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Trước</Button>
                        <span className="align-self-center small">Trang {page}/{totalPages || 1}</span>
                        <Button size="sm" variant="outline-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau ›</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ActivityLogs;
