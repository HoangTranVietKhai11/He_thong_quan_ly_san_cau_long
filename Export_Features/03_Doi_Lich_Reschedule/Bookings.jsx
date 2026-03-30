import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Nav, Modal, Alert, Form } from 'react-bootstrap';
import { BiCalendar, BiTime, BiMoney, BiCheckCircle, BiXCircle, BiTransferAlt, BiRefresh } from 'react-icons/bi';
import bookingService from '../../services/bookingService';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const statusConfig = {
    confirmed: { label: 'Đã xác nhận', color: 'success' },
    pending: { label: 'Chờ xác nhận', color: 'warning' },
    completed: { label: 'Hoàn thành', color: 'info' },
    cancelled: { label: 'Đã hủy', color: 'danger' },
};

// Pending countdown timer hook
const usePendingCountdown = (status) => {
    const [remaining, setRemaining] = useState(10 * 60); // 10 minutes
    useEffect(() => {
        if (status !== 'pending') return;
        const timer = setInterval(() => {
            setRemaining(r => (r <= 1 ? 0 : r - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [status]);
    return remaining;
};

const PendingCountdown = ({ bookingId }) => {
    const remaining = usePendingCountdown('pending');
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const percent = (remaining / (10 * 60)) * 100;
    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-warning fw-bold">⏱ Giữ chỗ còn lại:</small>
                <small className={`fw-bold ${remaining < 120 ? 'text-danger' : 'text-warning'}`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </small>
            </div>
            <ProgressBar
                now={percent}
                variant={percent > 50 ? 'warning' : percent > 20 ? 'danger' : 'danger'}
                style={{ height: 6 }}
            />
            {remaining === 0 && <small className="text-danger">Hết thời gian giữ chỗ!</small>}
        </div>
    );
};

const BookingCard = ({ booking, onCancel, onReschedule }) => {
    const statusInfo = statusConfig[booking.status] || { label: booking.status, color: 'secondary' };
    return (
        <Card className="border-0 shadow-sm h-100">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">{booking.courtName}</h5>
                        <p className="text-muted small mb-0">Mã: #{booking.id}</p>
                    </div>
                    <Badge bg={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
                <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                        <BiCalendar className="text-primary me-2" />
                        <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <BiTime className="text-primary me-2" />
                        <span>{booking.startTime} – {booking.endTime} ({booking.hours}h)</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <BiMoney className="text-primary me-2" />
                        <strong className="text-primary">{formatPrice(booking.totalPrice)}</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            {booking.paymentStatus === 'paid'
                                ? <><BiCheckCircle className="text-success me-2" /><span className="text-success small">Đã thanh toán</span></>
                                : <><BiXCircle className="text-warning me-2" /><span className="text-warning small">Chưa thanh toán</span></>
                            }
                        </div>
                        {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                            <Button variant="success" size="sm" as="a" href={`/user/payment/${booking.id}`}>
                                Thanh toán
                            </Button>
                        )}
                    </div>
                </div>

                {/* Pending countdown FE-03.2 */}
                {booking.status === 'pending' && <PendingCountdown bookingId={booking.id} />}

                <div className="d-flex gap-2 mt-3">
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <Button variant="outline-primary" size="sm" className="flex-grow-1"
                            onClick={() => onReschedule(booking)}>
                            <BiTransferAlt className="me-1" />Đổi lịch
                        </Button>
                    )}
                    {booking.status === 'completed' && (
                        <Button variant="outline-success" size="sm" className="flex-grow-1">
                            <BiRefresh className="me-1" />Đặt lại
                        </Button>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <Button variant="outline-danger" size="sm" onClick={() => onCancel(booking.id)}>
                            Hủy sân
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReschedule, setShowReschedule] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rescheduleForm, setRescheduleForm] = useState({ date: '', startTime: '', duration: 1 });
    const [toast, setToast] = useState('');
    const [rescheduling, setRescheduling] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await bookingService.getMyBookings();
                const mappedBookings = (res.data || []).map(b => {
                    const startH = parseInt(b.start_time?.split(':')[0] || 0);
                    const endH = parseInt(b.end_time?.split(':')[0] || 0);
                    const hours = endH - startH;

                    return {
                        id: b.id,
                        courtName: b.court_name || `Sân ${b.court_id}`,
                        date: b.booking_date,
                        startTime: b.start_time?.substring(0, 5),
                        endTime: b.end_time?.substring(0, 5),
                        totalPrice: b.total_price,
                        status: b.status === 'Fully Paid' || b.status === 'Active' ? 'confirmed' : (b.status === 'Cancelled' ? 'cancelled' : b.status.toLowerCase()),
                        paymentStatus: (b.status === 'Fully Paid' || b.status === 'Active') ? 'paid' : 'unpaid',
                        hours: hours > 0 ? hours : 1
                    };
                });
                setBookings(mappedBookings);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const filterBookings = (status) => {
        if (status === 'all') return bookings;
        if (status === 'upcoming') return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
        if (status === 'completed') return bookings.filter(b => b.status === 'completed');
        return bookings.filter(b => b.status === status);
    };

    const filteredBookings = filterBookings(activeTab);

    const handleCancel = async (id) => {
        if (window.confirm('Bạn có chắc muốn hủy đặt sân này?')) {
            try {
                await bookingService.cancelBooking(id);
                setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
                setToast('Đã hủy đặt sân thành công!');
                setTimeout(() => setToast(''), 5000);
            } catch (err) {
                alert(err.response?.data?.message || 'Lỗi khi hủy đặt sân');
            }
        }
    };

    const handleReschedule = (booking) => {
        setSelectedBooking(booking);
        setRescheduleForm({ date: booking.date, startTime: booking.startTime, duration: booking.hours || 1 });
        setShowReschedule(true);
    };

    const confirmReschedule = async () => {
        if (!rescheduleForm.date || !rescheduleForm.startTime) return;
        const startH = parseInt(rescheduleForm.startTime.split(':')[0]);
        const endH = startH + parseInt(rescheduleForm.duration);
        if (endH > 22) { alert('Giờ kết thúc vượt quá 22:00!'); return; }
        const newEndTime = `${String(endH).padStart(2, '0')}:00:00`;
        const newStartTime = `${rescheduleForm.startTime}:00`;

        setRescheduling(true);
        try {
            const res = await bookingService.rescheduleBooking(
                selectedBooking.id,
                { new_date: rescheduleForm.date, new_start_time: newStartTime, new_end_time: newEndTime }
            );
            const msg = res.message || 'Đổi lịch thành công!';
            setToast(msg);
            setTimeout(() => setToast(''), 6000);
            // Cập nhật local state
            setBookings(bookings.map(b => b.id === selectedBooking.id ? {
                ...b,
                date: rescheduleForm.date,
                startTime: rescheduleForm.startTime,
                endTime: String(endH).padStart(2, '0') + ':00',
                hours: parseInt(rescheduleForm.duration)
            } : b));
            setShowReschedule(false);
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Lỗi khi đổi lịch!');
        } finally {
            setRescheduling(false);
        }
    };

    const tabCounts = {
        all: bookings.length,
        upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Đặt sân của tôi</h2>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" href="/user/calendar">📅 Lịch sân</Button>
                    <Button variant="primary">Đặt sân mới</Button>
                </div>
            </div>

            {toast && <Alert variant="success" onClose={() => setToast('')} dismissible className="mb-3">{toast}</Alert>}

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Nav variant="pills">
                        {[
                            { key: 'all', label: 'Tất cả' },
                            { key: 'upcoming', label: 'Sắp tới' },
                            { key: 'completed', label: 'Hoàn thành' },
                            { key: 'cancelled', label: 'Đã hủy' },
                        ].map(tab => (
                            <Nav.Item key={tab.key}>
                                <Nav.Link active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
                                    {tab.label} <Badge bg={activeTab === tab.key ? 'light' : 'secondary'} text="dark" pill>{tabCounts[tab.key]}</Badge>
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Card.Body>
            </Card>

            <Row>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                        <Col key={booking.id} lg={6} className="mb-4">
                            <BookingCard
                                booking={booking}
                                onCancel={handleCancel}
                                onReschedule={handleReschedule}
                            />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="text-center py-5">
                                <BiCalendar size={60} className="text-muted mb-3" />
                                <h5 className="text-muted">Chưa có đặt sân nào</h5>
                                <p className="text-muted mb-4">Bắt đầu đặt sân cầu lông ngay hôm nay!</p>
                                <Button variant="primary">Đặt sân ngay</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Reschedule Modal FE-03.10 */}
            <Modal show={showReschedule} onHide={() => setShowReschedule(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title><BiTransferAlt className="me-2 text-primary" />Đổi lịch đặt sân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <Alert variant="info" className="small">
                                📌 <strong>Lịch cũ:</strong> {new Date(selectedBooking.date).toLocaleDateString('vi-VN')} lúc {selectedBooking.startTime} — {selectedBooking.courtName}
                            </Alert>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày mới <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" min={today} value={rescheduleForm.date}
                                    onChange={e => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giờ bắt đầu <span className="text-danger">*</span></Form.Label>
                                <Form.Select value={rescheduleForm.startTime}
                                    onChange={e => setRescheduleForm({ ...rescheduleForm, startTime: e.target.value })}>
                                    <option value="">Chọn giờ...</option>
                                    {Array.from({ length: 16 }, (_, i) => i + 6).map(h => (
                                        <option key={h} value={`${h}:00`}>{h}:00</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Số giờ thuê</Form.Label>
                                <Form.Select value={rescheduleForm.duration}
                                    onChange={e => setRescheduleForm({ ...rescheduleForm, duration: e.target.value })}>
                                    {[1, 2, 3, 4].map(h => (
                                        <option key={h} value={h}>{h} giờ</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Alert variant="warning" className="mt-3 small mb-0">
                                ⚠️ Sau khi đổi lịch, booking sẽ về trạng thái <strong>Chờ xác nhận</strong> và giữ chỗ 10 phút.
                            </Alert>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReschedule(false)}>Huỷ</Button>
                    <Button variant="primary" onClick={confirmReschedule}
                        disabled={!rescheduleForm.date || !rescheduleForm.startTime || rescheduling}>
                        {rescheduling ? 'Đang xử lý...' : 'Xác nhận đổi lịch'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Bookings;
