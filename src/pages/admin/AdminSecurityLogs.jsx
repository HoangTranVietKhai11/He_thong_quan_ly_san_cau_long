import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Form, Row, Col, Spinner } from 'react-bootstrap';
import { BiShieldQuarter, BiSearch, BiFilterAlt } from 'react-icons/bi';
import advancedService from '../../services/advancedService';

const AdminSecurityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ action: '', username: '' });

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await advancedService.getAuditLogs();
            setLogs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLogs(); }, []);

    const filteredLogs = logs.filter(log => {
        return (filter.action === '' || log.action.toLowerCase().includes(filter.action.toLowerCase())) &&
               (filter.username === '' || (log.username && log.username.toLowerCase().includes(filter.username.toLowerCase())));
    });

    const getActionBadge = (action) => {
        if (action.includes('LOGIN')) return 'primary';
        if (action.includes('DELETE')) return 'danger';
        if (action.includes('UPDATE')) return 'warning';
        if (action.includes('CREATE')) return 'success';
        return 'secondary';
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiShieldQuarter className="me-2 text-danger" />Nhật ký hệ thống</h2>
                    <p className="text-muted mb-0">Theo dõi mọi thay đổi dữ liệu và hoạt động truy cập quan trọng</p>
                </div>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="bg-light rounded">
                    <Row className="g-3">
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><BiFilterAlt /></span>
                                <Form.Control 
                                    placeholder="Lọc theo hành động (VD: DELETE)" 
                                    className="border-start-0"
                                    value={filter.action}
                                    onChange={e => setFilter({...filter, action: e.target.value})}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><BiSearch /></span>
                                <Form.Control 
                                    placeholder="Tìm theo username" 
                                    className="border-start-0"
                                    value={filter.username}
                                    onChange={e => setFilter({...filter, username: e.target.value})}
                                />
                            </div>
                        </Col>
                        <Col md={4} className="text-end">
                            <Badge bg="dark" className="p-2 px-3">Tổng số: {filteredLogs.length} sự kiện</Badge>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 overflow-hidden" borderless>
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="ps-4">Thời gian</th>
                                <th>Người thực hiện</th>
                                <th>Hành động</th>
                                <th>Chi tiết / Tài nguyên</th>
                                <th>IP Truy cập</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="primary" /></td></tr>
                            ) : filteredLogs.map(log => (
                                <tr key={log.id} className="border-bottom">
                                    <td className="ps-4 align-middle">
                                        <div className="fw-bold small">{new Date(log.created_at).toLocaleDateString('vi-VN')}</div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{new Date(log.created_at).toLocaleTimeString('vi-VN')}</div>
                                    </td>
                                    <td className="align-middle">
                                        <div className="d-flex align-items-center">
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee' }} className="d-flex align-items-center justify-content-center me-2 small fw-bold">
                                                {log.username ? log.username[0].toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="fw-bold small">{log.username || 'System Agent'}</div>
                                                <div className="text-muted" style={{ fontSize: '0.65rem' }}>ID: {log.user_id || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <Badge bg={getActionBadge(log.action)} className="text-uppercase small" style={{ fontSize: '0.65rem' }}>
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="align-middle">
                                        <code className="small text-dark p-1 bg-light rounded" style={{ fontSize: '0.75rem' }}>
                                            {log.resource_type}: {log.resource_id}
                                        </code>
                                    </td>
                                    <td className="align-middle text-muted small">{log.ip_address || '::1'}</td>
                                </tr>
                            ))}
                            {!loading && filteredLogs.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">Không tìm thấy dữ liệu nhật ký phù hợp</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminSecurityLogs;
