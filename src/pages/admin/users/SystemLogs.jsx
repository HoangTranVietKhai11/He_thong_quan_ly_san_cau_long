import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { BiSearch, BiRefresh, BiDownload } from 'react-icons/bi';

const generateLogs = () => {
    const actions = ['Đăng nhập', 'Đăng xuất', 'Thêm sân', 'Sửa sân', 'Xóa booking', 'Cấu hình giá', 'Thêm bảo trì', 'Khóa tài khoản', 'Xuất báo cáo', 'Đổi mật khẩu'];
    const users = ['admin@badminton.vn', 'admin2@badminton.vn', 'staff@badminton.vn'];
    const ips = ['192.168.1.100', '192.168.1.101', '10.0.0.5'];
    const results = ['success', 'success', 'success', 'success', 'failed'];
    const logs = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date('2026-03-03T20:00:00');
        d.setHours(d.getHours() - i * 2);
        logs.push({
            id: i + 1,
            time: d.toLocaleString('vi-VN'),
            user: users[i % users.length],
            action: actions[i % actions.length],
            ip: ips[i % ips.length],
            result: results[i % results.length],
            detail: `Thực hiện [${actions[i % actions.length]}] bởi ${users[i % users.length]}`
        });
    }
    return logs;
};

const allLogs = generateLogs();

const SystemLogs = () => {
    const [search, setSearch] = useState('');
    const [filterResult, setFilterResult] = useState('all');
    const [page, setPage] = useState(1);
    const perPage = 10;

    const filtered = allLogs.filter(l => {
        const matchSearch = l.user.includes(search) || l.action.includes(search) || l.ip.includes(search);
        const matchResult = filterResult === 'all' || l.result === filterResult;
        return matchSearch && matchResult;
    });

    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Nhật ký hệ thống</h2>
                    <p className="text-muted mb-0">Theo dõi toàn bộ hoạt động trong hệ thống</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                        <BiRefresh className="me-1" />Làm mới
                    </Button>
                    <Button variant="outline-primary">
                        <BiDownload className="me-1" />Xuất CSV
                    </Button>
                </div>
            </div>

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng sự kiện', value: allLogs.length, color: 'primary' },
                    { label: 'Thành công', value: allLogs.filter(l => l.result === 'success').length, color: 'success' },
                    { label: 'Thất bại', value: allLogs.filter(l => l.result === 'failed').length, color: 'danger' },
                ].map((s, i) => (
                    <Col md={4} key={i}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold text-uppercase mb-1`}>{s.label}</div>
                                <h3 className="fw-bold mb-0">{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Row className="g-2">
                        <Col md={8}>
                            <InputGroup>
                                <InputGroup.Text><BiSearch /></InputGroup.Text>
                                <Form.Control placeholder="Tìm theo email, hành động, IP..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Select value={filterResult} onChange={e => { setFilterResult(e.target.value); setPage(1); }}>
                                <option value="all">Tất cả kết quả</option>
                                <option value="success">Thành công</option>
                                <option value="failed">Thất bại</option>
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
                                    <th>#</th>
                                    <th>Thời gian</th>
                                    <th>Người dùng</th>
                                    <th>Hành động</th>
                                    <th>IP</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(log => (
                                    <tr key={log.id}>
                                        <td className="align-middle text-muted">{log.id}</td>
                                        <td className="align-middle">{log.time}</td>
                                        <td className="align-middle">{log.user}</td>
                                        <td className="align-middle fw-bold">{log.action}</td>
                                        <td className="align-middle text-muted">{log.ip}</td>
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
                    <small className="text-muted">Hiển thị {paginated.length}/{filtered.length} bản ghi</small>
                    <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>‹ Trước</Button>
                        <span className="align-self-center small">Trang {page}/{totalPages}</span>
                        <Button size="sm" variant="outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sau ›</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default SystemLogs;
