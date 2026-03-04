import React, { useState } from 'react';
import { Container, Card, Badge, Form, Row, Col } from 'react-bootstrap';
import { BiCalendar } from 'react-icons/bi';

const courts = [
    { id: 1, name: 'Sân 1', type: 'Standard' },
    { id: 2, name: 'Sân 2', type: 'Standard' },
    { id: 3, name: 'Sân 3', type: 'VIP' },
    { id: 4, name: 'Sân 4', type: 'Double' },
    { id: 5, name: 'Sân 5', type: 'Standard' },
    { id: 6, name: 'Sân 6', type: 'VIP' },
    { id: 7, name: 'Sân 7', type: 'Standard' },
    { id: 8, name: 'Sân 8', type: 'Standard' },
];

const hours = Array.from({ length: 17 }, (_, i) => i + 6);

const mockOccupied = {
    '3-8': 'Nguyễn Văn A', '3-9': 'Nguyễn Văn A',
    '1-14': 'Trần Thị B', '5-17': 'Lê Văn C', '5-18': 'Lê Văn C',
    '7-10': 'Phạm Thị D', '2-19': 'Đỗ Văn E',
    '6-7': null, '6-8': null, // maintenance
    '4-11': 'Hoàng Minh F', '4-12': 'Hoàng Minh F',
    '8-15': 'Vũ Thị G', '1-20': 'Trần Quang H', '2-13': 'Lê Kim I',
};

const priceByHour = (h) => {
    if (h >= 17 && h < 21) return 170000;
    if (h >= 9 && h < 14) return 150000;
    return 120000;
};

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const AdminLiveCalendar = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [tooltip, setTooltip] = useState(null);

    const getSlotState = (courtId, hour) => {
        const key = `${courtId}-${hour}`;
        if (mockOccupied[key] === null) return 'maintenance';
        if (mockOccupied[key]) return 'occupied';
        return 'available';
    };

    const bookedCount = Object.values(mockOccupied).filter(v => v !== null).length;
    const maintenanceCount = Object.values(mockOccupied).filter(v => v === null).length;
    const totalSlots = courts.length * hours.length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiCalendar className="me-2 text-primary" />Lịch sân tổng quan (Admin)</h2>
                    <p className="text-muted mb-0">Xem tình trạng tất cả sân theo thời gian thực — chỉ xem</p>
                </div>
                <Form.Control type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: 180 }} />
            </div>

            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng ô giờ', value: totalSlots, color: 'primary' },
                    { label: 'Đã đặt', value: bookedCount, color: 'info' },
                    { label: 'Còn trống', value: totalSlots - bookedCount - maintenanceCount, color: 'success' },
                    { label: 'Bảo trì', value: maintenanceCount, color: 'danger' },
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm text-center">
                            <Card.Body>
                                <div className={`text-${s.color} small fw-bold text-uppercase mb-1`}>{s.label}</div>
                                <h3 className="fw-bold mb-0">{s.value}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Legend */}
            <div className="d-flex gap-3 mb-3 flex-wrap small">
                {[
                    { color: '#d4edda', border: '#28a745', label: 'Còn trống' },
                    { color: '#cce5ff', border: '#004085', label: 'Đã đặt' },
                    { color: '#f8d7da', border: '#842029', label: 'Bảo trì' },
                ].map(l => (
                    <div key={l.label} className="d-flex align-items-center gap-2">
                        <div style={{ width: 18, height: 18, background: l.color, border: `2px solid ${l.border}`, borderRadius: 3 }} />
                        <span>{l.label}</span>
                    </div>
                ))}
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0" style={{ minWidth: 900 }}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: 80 }}>Giờ</th>
                                    {courts.map(c => (
                                        <th key={c.id} className="text-center small" style={{ minWidth: 100 }}>
                                            <div className="fw-bold">{c.name}</div>
                                            <Badge bg={c.type === 'VIP' ? 'warning' : c.type === 'Double' ? 'info' : 'secondary'} style={{ fontSize: '0.6rem' }}>
                                                {c.type}
                                            </Badge>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {hours.map(hour => (
                                    <tr key={hour}>
                                        <td className="text-center align-middle bg-light fw-bold small">
                                            {hour}:00
                                            <div style={{ fontSize: '0.6rem', color: '#999' }}>{fmt(priceByHour(hour))}</div>
                                        </td>
                                        {courts.map(court => {
                                            const state = getSlotState(court.id, hour);
                                            const key = `${court.id}-${hour}`;
                                            const occupant = mockOccupied[key];
                                            return (
                                                <td key={court.id}
                                                    style={{
                                                        background: state === 'available' ? '#d4edda' : state === 'occupied' ? '#cce5ff' : '#f8d7da',
                                                        padding: '4px 8px',
                                                        border: `1px solid ${state === 'available' ? '#28a745' : state === 'occupied' ? '#004085' : '#842029'}`,
                                                        fontSize: '0.72rem',
                                                        textAlign: 'center',
                                                        cursor: 'default',
                                                    }}
                                                    title={occupant ? `Đã đặt: ${occupant}` : state === 'maintenance' ? 'Bảo trì' : 'Trống'}
                                                >
                                                    {state === 'occupied' && <span className="text-primary fw-bold">{occupant?.split(' ').pop()}</span>}
                                                    {state === 'maintenance' && <span className="text-danger">🔧</span>}
                                                    {state === 'available' && <span className="text-success small">—</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminLiveCalendar;
