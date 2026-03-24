import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Table, Spinner } from 'react-bootstrap';
import { BiTime, BiUser, BiPlus, BiTrash, BiBell, BiErrorCircle } from 'react-icons/bi';
import courtService from '../../services/courtService';
import advancedService from '../../services/advancedService';

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const today = new Date().toISOString().split('T')[0];

const WaitlistBooking = () => {
    const [courts, setCourts] = useState([]);
    const [waitlist, setWaitlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ date: today, hour: 17, courtId: '', name: '', phone: '' });
    const [added, setAdded] = useState(false);
    const [error, setError] = useState('');
    const [hourlyPrice, setHourlyPrice] = useState(0);

    const loadData = async () => {
        setLoading(true);
        try {
            const courtsRes = await courtService.getCourts();
            const list = Array.isArray(courtsRes.data) ? courtsRes.data : courtsRes.data?.courts || [];
            setCourts(list);
            
            const waitlistRes = await advancedService.getMyWaitlist();
            setWaitlist(waitlistRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const checkPrice = async () => {
            if (!form.courtId) return;
            try {
                const time = `${form.hour.toString().padStart(2, '0')}:00`;
                const res = await advancedService.calculatePrice({
                    court_id: form.courtId,
                    date: form.date,
                    start_time: time,
                    end_time: `${(form.hour + 1).toString().padStart(2, '0')}:00`
                });
                setHourlyPrice(res.data.price);
            } catch (err) {
                setHourlyPrice(150000);
            }
        };
        checkPrice();
    }, [form.courtId, form.hour, form.date]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const startTime = `${form.hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(form.hour + 1).toString().padStart(2, '0')}:00`;
            
            await advancedService.addToWaitlist({
                court_id: form.courtId,
                booking_date: form.date,
                start_time: startTime,
                end_time: endTime
            });

            setAdded(true);
            loadData();
            setTimeout(() => setAdded(false), 4000);
            setForm({ date: today, hour: 17, courtId: '', name: '', phone: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi đăng ký chờ');
        }
    };

    const statusInfo = {
        Waiting: { label: 'Đang chờ', color: 'warning', icon: '⏳' },
        Notified: { label: 'Đã thông báo', color: 'success', icon: '🔔' },
        Expired: { label: 'Hết hạn', color: 'secondary', icon: '⏰' },
        Cancelled: { label: 'Đã hủy', color: 'danger', icon: '✕' },
        'Booking Created': { label: 'Đã chốt sân', color: 'info', icon: '✅' },
    };

    if (loading && courts.length === 0) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiTime className="me-2 text-warning" />Đăng ký chờ sân</h2>
                    <p className="text-muted mb-0">Đăng ký vào hàng đợi để nhận thông báo ngay khi có sân trống</p>
                </div>
            </div>

            {added && <Alert variant="success" dismissible onClose={() => setAdded(false)}>
                <BiBell className="me-2" /><strong>Đăng ký thành công!</strong> Chúng tôi sẽ gửi thông báo App/SMS ngay khi có chỗ trống.
            </Alert>}

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}><BiErrorCircle className="me-2" />{error}</Alert>}

            <Row className="g-4">
                <Col md={5}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold"><BiPlus className="me-2 text-primary" />Đăng ký chờ mới</Card.Header>
                        <Card.Body>
                            <Alert variant="info" className="small border-0 shadow-sm" style={{ background: '#e3f2fd' }}>
                                ℹ️ Khi có khách hủy sân cùng khung giờ, hệ thống sẽ <strong>ưu tiên thông báo</strong> cho bạn. Bạn sẽ có <strong>30 phút</strong> để chốt sân trước khi chuyển sang người tiếp theo.
                            </Alert>
                            <Form onSubmit={handleAdd}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ngày muốn chơi</Form.Label>
                                    <Form.Control type="date" min={today} value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })} required />
                                </Form.Group>
                                <Row className="g-2 mb-3">
                                    <Col xs={7}>
                                        <Form.Label>Khung giờ</Form.Label>
                                        <Form.Select value={form.hour} onChange={e => setForm({ ...form, hour: +e.target.value })}>
                                            {Array.from({ length: 17 }, (_, i) => i + 6).map(h => (
                                                <option key={h} value={h}>{h}:00 – {h + 1}:00</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={5}>
                                        <Form.Label>Chọn sân</Form.Label>
                                        <Form.Select value={form.courtId} onChange={e => setForm({ ...form, courtId: e.target.value })} required>
                                            <option value="">Chọn sân...</option>
                                            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <div className="p-3 bg-light rounded text-center mb-4 border border-dashed">
                                    <span className="text-muted small">Giá dự kiến:</span><br/>
                                    <strong className="text-primary">{fmt(hourlyPrice || 150000)}</strong>
                                </div>
                                <Button type="submit" variant="warning" className="w-100 text-dark fw-bold py-2 shadow-sm">
                                    <BiTime className="me-2" />Đăng ký vào hàng đợi
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Trạng thái danh sách chờ ({waitlist.length})</Card.Header>
                        <Card.Body className="p-0">
                            {waitlist.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <BiTime size={48} className="mb-3 opacity-25" />
                                    <p>Bạn chưa có đăng ký chờ nào</p>
                                </div>
                            ) : (
                                <Table hover className="mb-0 overflow-hidden" responsive>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Ngày / Giờ</th>
                                            <th>Sân</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitlist.map(item => {
                                            const info = statusInfo[item.status] || statusInfo.Waiting;
                                            return (
                                                <tr key={item.id}>
                                                    <td className="align-middle">
                                                        <div className="fw-bold">{new Date(item.booking_date).toLocaleDateString('vi-VN')}</div>
                                                        <div className="text-muted small">{item.start_time.substring(0,5)} – {item.end_time.substring(0,5)}</div>
                                                    </td>
                                                    <td className="align-middle">{item.court_name}</td>
                                                    <td className="align-middle">
                                                        <Badge bg={info.color} className="p-2">
                                                            {info.icon} {info.label}
                                                        </Badge>
                                                        {item.status === 'Notified' && (
                                                            <div className="text-success x-small mt-1 fw-bold">ƯU TIÊN: Đang chờ bạn chốt!</div>
                                                        )}
                                                    </td>
                                                    <td className="align-middle text-muted small">
                                                        {new Date(item.created_at).toLocaleString('vi-VN')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WaitlistBooking;
