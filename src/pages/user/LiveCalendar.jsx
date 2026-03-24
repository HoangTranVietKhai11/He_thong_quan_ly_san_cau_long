import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { BiCalendar, BiLeftArrow, BiRightArrow, BiCheck, BiErrorCircle, BiTag } from 'react-icons/bi';
import courtService from '../../services/courtService';
import bookingService from '../../services/bookingService';
import advancedService from '../../services/advancedService';
import voucherService from '../../services/voucherService';

const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6:00 → 22:00

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const LiveCalendar = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [courts, setCourts] = useState([]);
    const [occupiedSlots, setOccupiedSlots] = useState({});
    const [hourlyPrices, setHourlyPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null); // { courtId, hour }
    const [bookingForm, setBookingForm] = useState({ duration: 1 });
    const [success, setSuccess] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherInfo, setVoucherInfo] = useState(null); // { discount, final_price, voucher }
    const [voucherError, setVoucherError] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // 1. Fetch Courts
            const courtsRes = await courtService.getCourts();
            const courtList = Array.isArray(courtsRes.data) ? courtsRes.data : courtsRes.data?.courts || [];
            setCourts(courtList);

            // 2. Fetch Bookings for date
            const bookingsRes = await bookingService.getBookingsByDate(selectedDate);
            const bookings = bookingsRes.data || [];
            const slotMap = {};
            bookings.forEach(b => {
                const startHour = parseInt(b.start_time.split(':')[0]);
                const endHour = parseInt(b.end_time.split(':')[0]);
                for (let h = startHour; h < endHour; h++) {
                    slotMap[`${b.court_id}-${h}`] = b.username;
                }
            });
            setOccupiedSlots(slotMap);

            // 3. Fetch base prices (simplified: use first court's price or calculate for each)
            // For the grid view, we'll try to get pricing rules for the date
            // 3. Fetch base prices for the grid
            const prices = {};
            if (courtList.length > 0) {
                for (const h of hours) {
                    const time = `${h.toString().padStart(2, '0')}:00`;
                    try {
                        const priceRes = await advancedService.calculatePrice({
                            court_id: courtList[0].id,
                            date: selectedDate,
                            start_time: time,
                            end_time: `${(h + 1).toString().padStart(2, '0')}:00`
                        });
                        prices[h] = priceRes.price || courtList[0].price_per_hour || 0;
                    } catch (e) {
                        prices[h] = courtList[0].price_per_hour || 0;
                    }
                }
            }
            setHourlyPrices(prices);

        } catch (err) {
            setError('Không thể tải dữ liệu lịch sân. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getSlotState = (courtId, hour) => {
        const key = `${courtId}-${hour}`;
        const court = courts.find(c => c.id === courtId);
        if (court?.is_maintenance) return 'maintenance';
        if (occupiedSlots[key]) return 'occupied';
        return 'available';
    };

    const handleCellClick = (courtId, hour) => {
        const state = getSlotState(courtId, hour);
        if (state !== 'available') return;
        setSelected({ courtId, hour });
        setBookingForm({ duration: 1 });
        setVoucherCode('');
        setVoucherInfo(null);
        setVoucherError('');
        setShowModal(true);
    };

    const handleCheckVoucher = async () => {
        if (!voucherCode.trim()) return;
        setVoucherLoading(true);
        setVoucherError('');
        setVoucherInfo(null);
        try {
            const res = await voucherService.applyVoucher(voucherCode.trim(), totalPrice);
            setVoucherInfo(res.data?.data || res.data);
        } catch (err) {
            setVoucherError(err.response?.data?.message || 'Mã voucher không hợp lệ!');
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleBook = async () => {
        setBookingLoading(true);
        try {
            const startTime = `${selected.hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(selected.hour + bookingForm.duration).toString().padStart(2, '0')}:00`;
            
            const res = await bookingService.createBooking({
                court_id: selected.courtId,
                booking_date: selectedDate,
                start_time: startTime,
                end_time: endTime,
                voucher_code: voucherCode.trim() || undefined
            });

            const data = res.data || {};
            const msg = data.message || `Đặt sân thành công! (${startTime} - ${endTime}). Vui lòng thanh toán tại quầy khi đến sân.`;
            setShowModal(false);
            setSuccess(msg);
            fetchData();
            setTimeout(() => setSuccess(''), 7000);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi đặt sân');
        } finally {
            setBookingLoading(false);
        }
    };

    const currentPrice = selected ? hourlyPrices[selected.hour] : 0;
    const totalPrice = currentPrice * bookingForm.duration;
    const finalPrice = voucherInfo ? voucherInfo.final_price : totalPrice;
    const discountAmount = voucherInfo ? voucherInfo.discount : 0;
    const court = selected ? courts.find(c => c.id === selected.courtId) : null;

    if (loading && courts.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải lịch sân...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiCalendar className="me-2 text-primary" />Lịch sân trực tiếp</h2>
                    <p className="text-muted mb-0">Xem trạng thái sân thực tế tại CLB và đặt ngay</p>
                </div>
                <Form.Control type="date" value={selectedDate}
                    min={today}
                    onChange={e => setSelectedDate(e.target.value)}
                    style={{ width: 180 }} />
            </div>

            {error && <Alert variant="danger" className="d-flex align-items-center"><BiErrorCircle className="me-2" />{error}</Alert>}
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
                <div className="ms-auto small text-muted">Click ô xanh để chốt sân (Thanh toán tại quầy)</div>
            </div>

            {/* Calendar Grid */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0" style={{ minWidth: 900 }}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: 100, minWidth: 100 }}>Giờ</th>
                                    {courts.map(c => (
                                        <th key={c.id} className="text-center small" style={{ minWidth: 90 }}>
                                            <div className="fw-bold">{c.name}</div>
                                            <Badge bg={c.is_maintenance ? 'danger' : 'success'} style={{ fontSize: '0.6rem' }}>
                                                {c.is_maintenance ? 'Maintenance' : 'Active'}
                                            </Badge>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {hours.map(hour => (
                                    <tr key={hour}>
                                        <td className="text-center align-middle bg-light fw-bold small py-3">
                                            {hour}:00
                                            <div className="text-primary mt-1" style={{ fontSize: '0.7rem' }}>
                                                {hourlyPrices[hour] ? formatPrice(hourlyPrices[hour]) : '...'}
                                            </div>
                                        </td>
                                        {courts.map(court => {
                                            const state = getSlotState(court.id, hour);
                                            const occupant = occupiedSlots[`${court.id}-${hour}`];
                                            return (
                                                <td key={court.id}
                                                    style={{
                                                        background: state === 'available' ? '#d4edda' : state === 'occupied' ? '#cce5ff' : '#f8d7da',
                                                        cursor: state === 'available' ? 'pointer' : 'default',
                                                        padding: '4px 6px',
                                                        border: `1px solid ${state === 'available' ? '#28a745' : state === 'occupied' ? '#004085' : '#842029'}`,
                                                        transition: 'all 0.1s',
                                                        fontSize: '0.7rem',
                                                        textAlign: 'center',
                                                        verticalAlign: 'middle'
                                                    }}
                                                    onClick={() => handleCellClick(court.id, hour)}
                                                    onMouseEnter={e => { if (state === 'available') e.currentTarget.style.transform = 'scale(1.02)'; }}
                                                    onMouseLeave={e => { if (state === 'available') e.currentTarget.style.transform = 'scale(1)'; }}
                                                >
                                                    {state === 'occupied' && <span className="text-primary fw-bold">{occupant}</span>}
                                                    {state === 'maintenance' && <span className="text-danger">Maintenance</span>}
                                                    {state === 'available' && <span className="text-success small">Nhấn để đặt</span>}
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
            <Modal show={showModal} onHide={() => { if(!bookingLoading) setShowModal(false); }} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Xác nhận đặt sân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="bg-light rounded p-3 mb-3 border">
                        <Row>
                            <Col xs={6} className="mb-2"><strong>Tên sân:</strong><br/>{court?.name}</Col>
                            <Col xs={6} className="mb-2"><strong>Ngày:</strong><br/>{new Date(selectedDate).toLocaleDateString('vi-VN')}</Col>
                            <Col xs={6}><strong>Bắt đầu:</strong><br/>{selected?.hour}:00</Col>
                            <Col xs={6}><strong>Đơn giá:</strong><br/><span className="text-primary">{formatPrice(currentPrice)}/h</span></Col>
                        </Row>
                    </div>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Thời lượng thuê (giờ)</Form.Label>
                        <Form.Select 
                            value={bookingForm.duration} 
                            onChange={e => { setBookingForm({ ...bookingForm, duration: +e.target.value }); setVoucherInfo(null); setVoucherError(''); }}
                            disabled={bookingLoading}
                        >
                            {[1, 2, 3, 4].map(d => (
                                <option key={d} value={d}>
                                    {d} giờ ({selected?.hour}:00 - {selected?.hour + d}:00)
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted small">Mỗi tài khoản được đặt tối đa 4 tiếng liên tục.</Form.Text>
                    </Form.Group>

                    {/* Voucher Input */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold"><BiTag className="me-1 text-success" />Địa mã Voucher (tùy chọn)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                placeholder="Nhập mã voucher..."
                                value={voucherCode}
                                onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherInfo(null); setVoucherError(''); }}
                                disabled={bookingLoading}
                                onKeyPress={e => e.key === 'Enter' && handleCheckVoucher()}
                            />
                            <Button variant="outline-success" onClick={handleCheckVoucher} disabled={voucherLoading || !voucherCode.trim()}>
                                {voucherLoading ? <Spinner size="sm" /> : 'Kiểm tra'}
                            </Button>
                        </InputGroup>
                        {voucherError && <div className="text-danger small mt-1">❌ {voucherError}</div>}
                        {voucherInfo && (
                            <div className="mt-1 p-2 rounded bg-success bg-opacity-10 border border-success">
                                <span className="text-success small fw-bold">✅ Áp dụng thành công! Giảm {formatPrice(voucherInfo.discount)}</span>
                            </div>
                        )}
                    </Form.Group>

                    <div className="p-3 bg-dark text-white rounded shadow-sm border border-secondary">
                        {discountAmount > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="small text-muted">Giá gốc:</span>
                                <span className="text-decoration-line-through text-muted">{formatPrice(totalPrice)}</span>
                            </div>
                        )}
                        {discountAmount > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-success">Giảm giá Voucher:</span>
                                <span className="text-success fw-bold">-{formatPrice(discountAmount)}</span>
                            </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="small fw-bold">TỔNG GIÁ THUÊ:</span>
                            <strong className="text-warning" style={{ fontSize: '1.4rem' }}>{formatPrice(finalPrice)}</strong>
                        </div>
                        <div className="text-center mt-2 small text-muted italic" style={{ fontSize: '0.75rem' }}>
                            Quý khách vui lòng thanh toán tại quầy khi đến nhận sân.
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)} disabled={bookingLoading}>Đóng</Button>
                    <Button variant="primary" onClick={handleBook} disabled={bookingLoading} className="px-4">
                        {bookingLoading ? <Spinner size="sm" className="me-2" /> : <BiCheck className="me-2" />}
                        Chốt sân ngay
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default LiveCalendar;
