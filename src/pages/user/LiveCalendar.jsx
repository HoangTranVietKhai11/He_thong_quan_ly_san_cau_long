import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { BiCalendar, BiLeftArrow, BiRightArrow, BiCheck } from 'react-icons/bi';

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

const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 → 22:00

// Mock occupied slots
const mockOccupied = {
    '3-8': 'Nguyễn Văn A',
    '3-9': 'Nguyễn Văn A',
    '1-14': 'Trần Thị B',
    '5-17': 'Lê Văn C',
    '5-18': 'Lê Văn C',
    '7-10': 'Phạm Thị D',
    '2-19': 'Đỗ Văn E',
    '6-7': null, // maintenance
};

const priceByHour = (h) => {
    if (h >= 17 && h < 21) return 170000;
    if (h >= 9 && h < 14) return 150000;
    return 120000;
};

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const LiveCalendar = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null); // { courtId, hour }
    const [bookingForm, setBookingForm] = useState({ duration: 1, name: '', phone: '' });
    const [booked, setBooked] = useState({});
    const [success, setSuccess] = useState('');

    const allOccupied = { ...mockOccupied, ...booked };

    const getSlotState = (courtId, hour) => {
        const key = `${courtId}-${hour}`;
        if (courtId === 6 && hour >= 6 && hour < 9) return 'maintenance';
        if (allOccupied[key] === null) return 'maintenance';
        if (allOccupied[key]) return 'occupied';
        return 'available';
    };

    const handleCellClick = (courtId, hour) => {
        const state = getSlotState(courtId, hour);
        if (state !== 'available') return;
        setSelected({ courtId, hour });
        setBookingForm({ duration: 1, name: '', phone: '' });
        setShowModal(true);
    };

    const handleBook = () => {
        if (!bookingForm.name || !bookingForm.phone) return;
        const newBooked = { ...booked };
        for (let h = selected.hour; h < selected.hour + bookingForm.duration; h++) {
            newBooked[`${selected.courtId}-${h}`] = bookingForm.name;
        }
        setBooked(newBooked);
        setShowModal(false);
        setSuccess(`Đặt sân thành công! ${courts.find(c => c.id === selected.courtId)?.name}, ${selected.hour}:00 - ${selected.hour + bookingForm.duration}:00`);
        setTimeout(() => setSuccess(''), 4000);
    };

    const totalPrice = selected ? bookingForm.duration * priceByHour(selected.hour) : 0;

    const court = selected ? courts.find(c => c.id === selected.courtId) : null;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiCalendar className="me-2 text-primary" />Lịch sân trực tiếp</h2>
                    <p className="text-muted mb-0">Xem trạng thái sân theo thời gian thực và đặt ngay</p>
                </div>
                <Form.Control type="date" value={selectedDate}
                    min={today}
                    onChange={e => setSelectedDate(e.target.value)}
                    style={{ width: 180 }} />
            </div>

            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}><BiCheck className="me-2" />{success}</Alert>}

            {/* Legend */}
            <div className="d-flex gap-3 mb-3 flex-wrap">
                {[
                    { color: '#d4edda', border: '#28a745', label: 'Còn trống' },
                    { color: '#cce5ff', border: '#004085', label: 'Đã đặt' },
                    { color: '#f8d7da', border: '#842029', label: 'Bảo trì' },
                ].map(l => (
                    <div key={l.label} className="d-flex align-items-center gap-2">
                        <div style={{ width: 20, height: 20, background: l.color, border: `2px solid ${l.border}`, borderRadius: 4 }} />
                        <span className="small">{l.label}</span>
                    </div>
                ))}
                <div className="ms-auto small text-muted">Click ô xanh để đặt sân</div>
            </div>

            {/* Calendar Grid */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0" style={{ minWidth: 900 }}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: 80, minWidth: 80 }}>Giờ</th>
                                    {courts.map(c => (
                                        <th key={c.id} className="text-center small" style={{ minWidth: 90 }}>
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
                                            <div style={{ fontSize: '0.6rem', color: '#999' }}>{formatPrice(priceByHour(hour))}</div>
                                        </td>
                                        {courts.map(court => {
                                            const state = getSlotState(court.id, hour);
                                            const key = `${court.id}-${hour}`;
                                            const occupant = allOccupied[key];
                                            return (
                                                <td key={court.id}
                                                    style={{
                                                        background: state === 'available' ? '#d4edda' : state === 'occupied' ? '#cce5ff' : '#f8d7da',
                                                        cursor: state === 'available' ? 'pointer' : 'default',
                                                        padding: '4px 6px',
                                                        border: `1px solid ${state === 'available' ? '#28a745' : state === 'occupied' ? '#004085' : '#842029'}`,
                                                        transition: 'opacity 0.15s',
                                                        fontSize: '0.7rem',
                                                        textAlign: 'center',
                                                    }}
                                                    onClick={() => handleCellClick(court.id, hour)}
                                                    onMouseEnter={e => { if (state === 'available') e.currentTarget.style.opacity = '0.75'; }}
                                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                    title={state === 'occupied' ? `Đã đặt: ${occupant}` : state === 'maintenance' ? 'Đang bảo trì' : 'Còn trống — nhấn để đặt'}
                                                >
                                                    {state === 'occupied' && <span className="text-primary fw-bold">{occupant?.split(' ').pop()}</span>}
                                                    {state === 'maintenance' && <span className="text-danger">🔧</span>}
                                                    {state === 'available' && <span className="text-success">+</span>}
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

            {/* Booking Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Đặt sân {court?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="bg-light rounded p-3 mb-3">
                        <Row className="small">
                            <Col><strong>Sân:</strong> {court?.name} ({court?.type})</Col>
                            <Col><strong>Giờ bắt đầu:</strong> {selected?.hour}:00</Col>
                        </Row>
                        <Row className="small mt-2">
                            <Col><strong>Ngày:</strong> {new Date(selectedDate).toLocaleDateString('vi-VN')}</Col>
                            <Col><strong>Giá/giờ:</strong> {selected && formatPrice(priceByHour(selected.hour))}</Col>
                        </Row>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Thuê thêm (giờ)</Form.Label>
                        <Form.Select value={bookingForm.duration} onChange={e => setBookingForm({ ...bookingForm, duration: +e.target.value })}>
                            {[1, 2, 3, 4].map(d => <option key={d} value={d}>{d} giờ ({selected && `${selected.hour}:00 - ${selected.hour + d}:00`})</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên của bạn <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Nguyễn Văn A" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                        <Form.Control value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="09xxxxxxxx" />
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center p-3 bg-primary text-white rounded">
                        <span>Tổng tiền:</span>
                        <strong style={{ fontSize: '1.3rem' }}>{formatPrice(totalPrice)}</strong>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleBook} disabled={!bookingForm.name || !bookingForm.phone}>
                        <BiCheck className="me-2" />Xác nhận đặt sân
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default LiveCalendar;
