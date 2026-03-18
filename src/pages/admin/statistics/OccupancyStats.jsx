import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { BiPieChart, BiCalendar } from 'react-icons/bi';
import adminStatsService from '../../../services/adminStatsService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const OccupancyStats = () => {
    const [period, setPeriod] = useState('month');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOccupancy = async () => {
            try {
                setLoading(true);
                const res = await adminStatsService.getOccupancyRate();
                setStats(res.data?.data || res.data);
            } catch (err) {
                setError('Lỗi tải dữ liệu tỷ lệ sử dụng: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchOccupancy();
    }, [period]);

    if (loading) return <div className="d-flex justify-content-center pt-5"><Spinner animation="border" /></div>;

    // Use safe parsing, calculate avg occupancy based on true backend logic
    const totalUsed = parseFloat(stats?.total_booked_hours || 0);
    const totalAvail = parseFloat(stats?.max_possible_hours || 1);
    const avgOccupancy = parseFloat(stats?.occupancy_rate || 0).toFixed(1);
    
    // For visual grid currently, mock an example because the backend calculates as a total pool right now
    // A future enhancement could split it out per court. 
    const isMockGrid = true;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiPieChart className="me-2 text-info" />Tỷ lệ sử dụng sân (Occupancy)</h2>
                    <p className="text-muted mb-0">Theo dõi mức độ sử dụng từng sân theo thời gian</p>
                </div>
                <Form.Select value={period} onChange={e => setPeriod(e.target.value)} style={{ width: 160 }}>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                </Form.Select>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tỷ lệ Occupancy Hệ thống', value: `${avgOccupancy}%`, sub: 'Tổng hệ thống', color: avgOccupancy > 75 ? 'success' : avgOccupancy > 40 ? 'warning' : 'danger' },
                    { label: 'Tổng giờ khả dụng', value: `${totalAvail} giờ`, sub: 'Dựa trên 16h hoạt động', color: 'primary' },
                    { label: 'Tổng giờ đã được đặt', value: `${totalUsed} giờ`, sub: 'Trong tháng', color: 'success' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold`}>{s.label}</div>
                                <h4 className="fw-bold mb-0">{s.value}</h4>
                                <small className="text-muted">{s.sub}</small>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {isMockGrid && (
                <Alert variant="info" className="mb-0">
                    Hệ thống backend hiện đang trả về thông số thống kê theo toàn bộ Cơ sở (thay vì chi tiết từng sân). Các tính năng chia nhỏ Tỷ lệ sử dụng từng sân sẽ được thiết kế ở các phiên bản tiếp theo khi API bổ sung tham số sân cụ thể.
                </Alert>
            )}
        </Container>
    );
};

export default OccupancyStats;
