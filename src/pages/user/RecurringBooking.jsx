import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Spinner } from 'react-bootstrap';
import { BiCalendar, BiRepeat, BiCheck, BiInfoCircle } from 'react-icons/bi';
import courtService from '../../services/courtService';
import advancedService from '../../services/advancedService';

const weekdays = [
    { key: 1, label: 'T2' }, { key: 2, label: 'T3' }, { key: 3, label: 'T4' },
    { key: 4, label: 'T5' }, { key: 5, label: 'T6' }, { key: 6, label: 'T7' }, { key: 0, label: 'CN' },
];

const fmt = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

function generateDates(from, to, days) {
    const result = [];
    const cursor = new Date(from);
    const end = new Date(to);
    while (cursor <= end) {
        if (days.includes(cursor.getDay())) {
            result.push(cursor.toISOString().split('T')[0]);
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    return result;
}

const RecurringBooking = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];

    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        startDate: today,
        endDate: nextMonthStr,
        selectedDays: [1, 3, 5],
        startHour: 17,
        duration: 1,
        courtId: '',
    });
    const [step, setStep] = useState(1);
    const [previewDates, setPreviewDates] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [hourlyPrice, setHourlyPrice] = useState(0);

    useEffect(() => {
        const loadCourts = async () => {
            try {
                const res = await courtService.getCourts();
                const list = Array.isArray(res.data) ? res.data : res.data?.courts || [];
                setCourts(list);
                if (list.length > 0) setForm(f => ({ ...f, courtId: list[0].id }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCourts();
    }, []);

    useEffect(() => {
        const checkPrice = async () => {
            if (!form.courtId) return;
            try {
                const time = `${form.startHour.toString().padStart(2, '0')}:00`;
                const res = await advancedService.calculatePrice({
                    court_id: form.courtId,
                    date: form.startDate,
                    start_time: time,
                    end_time: `${(form.startHour + 1).toString().padStart(2, '0')}:00`
                });
                setHourlyPrice(res.data.price);
            } catch (err) {
                setHourlyPrice(150000); // fallback
            }
        };
        checkPrice();
    }, [form.courtId, form.startHour, form.startDate]);

    const toggleDay = (day) => {
        setForm(p => ({
            ...p,
            selectedDays: p.selectedDays.includes(day)
                ? p.selectedDays.filter(d => d !== day)
                : [...p.selectedDays, day]
        }));
    };

    const handlePreview = () => {
        const dates = generateDates(form.startDate, form.endDate, form.selectedDays);
        setPreviewDates(dates);
        setStep(2);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                court_id: form.courtId,
                start_date: form.startDate,
                end_date: form.endDate,
                days_of_week: form.selectedDays.join(','),
                start_time: `${form.startHour.toString().padStart(2, '0')}:00`,
                end_time: `${(form.startHour + form.duration).toString().padStart(2, '0')}:00`
            };
            const res = await advancedService.createRecurring(payload);
            setStep(3);
            setMessage(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi thiết lập lịch');
        } finally {
            setSubmitting(false);
        }
    };

    const totalPrice = previewDates.length * form.duration * hourlyPrice;

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container fluid className="py-4">
            <div className="d-flex align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiRepeat className="me-2 text-primary" />Đặt sân định kỳ</h2>
                    <p className="text-muted mb-0">Thiết lập lịch chơi cố định hàng tuần và nhận ưu đãi giảm giá</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="d-flex align-items-center mb-4">
                {['Thiết lập', 'Kiểm tra', 'Hoàn tất'].map((s, i) => (
                    <React.Fragment key={i}>
                        <div className={`d-flex align-items-center gap-2 small fw-bold ${step >= i + 1 ? 'text-primary' : 'text-muted'}`}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: step > i + 1 ? '#0d6efd' : step === i + 1 ? '#0d6efd' : '#dee2e6',
                                color: step >= i + 1 ? '#fff' : '#666',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>{step > i + 1 ? '✓' : i + 1}</div>
                            {s}
                        </div>
                        {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#0d6efd' : '#dee2e6', margin: '0 12px' }} />}
                    </React.Fragment>
                ))}
            </div>

            {step === 1 && (
                <Row className="g-4">
                    <Col md={8}>
                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">1. Thời gian áp dụng</Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Label>Ngày bắt đầu</Form.Label>
                                        <Form.Control type="date" min={today} value={form.startDate}
                                            onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Ngày kết thúc</Form.Label>
                                        <Form.Control type="date" min={form.startDate} value={form.endDate}
                                            onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">2. Tần suất (Các thứ trong tuần)</Card.Header>
                            <Card.Body>
                                <div className="d-flex gap-2 flex-wrap">
                                    {weekdays.map(d => (
                                        <Button key={d.key} size="sm"
                                            variant={form.selectedDays.includes(d.key) ? 'primary' : 'outline-secondary'}
                                            onClick={() => toggleDay(d.key)}
                                            style={{ width: 48, height: 48, borderRadius: '50%', fontWeight: 'bold' }}>
                                            {d.label}
                                        </Button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">3. Chi tiết khung giờ & Sân</Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={4}>
                                        <Form.Label>Giờ bắt đầu</Form.Label>
                                        <Form.Select value={form.startHour} onChange={e => setForm({ ...form, startHour: +e.target.value })}>
                                            {Array.from({ length: 17 }, (_, i) => i + 6).map(h => (
                                                <option key={h} value={h}>{h}:00</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Số tiếng thuê/buổi</Form.Label>
                                        <Form.Select value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}>
                                            {[1, 2, 3].map(d => <option key={d} value={d}>{d} giờ</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Chọn sân</Form.Label>
                                        <Form.Select value={form.courtId} onChange={e => setForm({ ...form, courtId: e.target.value })}>
                                            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: 20 }}>
                            <Card.Header className="bg-primary text-white fw-bold">Tóm tắt cấu hình</Card.Header>
                            <Card.Body>
                                <div className="mb-2 small"><strong>Cố định:</strong> {form.selectedDays.map(d => weekdays.find(w => w.key === d)?.label).join(', ')}</div>
                                <div className="mb-2 small"><strong>Khung giờ:</strong> {form.startHour}:00 – {form.startHour + form.duration}:00</div>
                                <div className="mb-3 small"><strong>Sân:</strong> {courts.find(c => c.id == form.courtId)?.name}</div>
                                <div className="p-2 bg-light rounded border mb-3">
                                    <BiInfoCircle className="me-2 text-info" />
                                    <span className="small">Hệ thống sẽ tự động trừ phí từ ví của bạn cho trọn gói này.</span>
                                </div>
                                <Button className="w-100" onClick={handlePreview} disabled={form.selectedDays.length === 0}>
                                    Tiếp tục kiểm tra lịch →
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {step === 2 && (
                <Row className="g-4">
                    <Col md={8}>
                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Lịch thi đấu dự kiến ({previewDates.length} buổi)</span>
                                <Badge bg="primary">{previewDates.length} slots</Badge>
                            </Card.Header>
                            <Card.Body style={{ maxHeight: 500, overflowY: 'auto' }}>
                                <Alert variant="warning" className="small">
                                    Lưu ý: Nếu một ngày trong danh sách đã có người đặt, hệ thống sẽ bỏ qua ngày đó và chỉ tính tiền các ngày còn lại.
                                </Alert>
                                <Row className="g-2">
                                    {previewDates.map((date, i) => (
                                        <Col md={6} key={i}>
                                            <div className="d-flex align-items-center gap-2 p-2 border rounded small shadow-sm bg-white">
                                                <div className="text-center px-2 border-end">
                                                    <div className="fw-bold text-primary">{new Date(date).getDate()}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.6rem' }}>Th.{new Date(date).getMonth()+1}</div>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">{new Date(date).toLocaleDateString('vi-VN', { weekday: 'long' })}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{form.startHour}:00 - {form.startHour + form.duration}:00</div>
                                                </div>
                                                <Badge bg="light" text="dark" border>{fmt(form.duration * hourlyPrice)}</Badge>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: 20 }}>
                            <Card.Header className="bg-dark text-white fw-bold">Thanh toán trọn gói</Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tổng số buổi:</span>
                                    <span>{previewDates.length} buổi</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Đơn giá/buổi:</span>
                                    <span>{fmt(form.duration * hourlyPrice)}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-bold">TỔNG CỘNG:</span>
                                    <strong className="text-primary fs-4">{fmt(totalPrice)}</strong>
                                </div>
                                <Button className="w-100 mb-2" size="lg" onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? <Spinner size="sm" /> : <BiCheck className="me-1" />}
                                    Xác nhận thanh toán & Đặt
                                </Button>
                                <Button variant="outline-secondary" className="w-100" onClick={() => setStep(1)} disabled={submitting}>
                                    Quay lại chỉnh sửa
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {step === 3 && (
                <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                        <div style={{ fontSize: 70 }}>✅</div>
                        <h2 className="fw-bold mt-3">Hoàn tất thiết lập!</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: 500 }}>
                            {message || `Hệ thống đã ghi nhận lịch định kỳ của bạn. Các đơn đặt sân đã được tạo tự động và thanh toán qua ví thành công.`}
                        </p>
                        <hr className="my-4 mx-auto" style={{ width: 100 }} />
                        <Button variant="primary" size="lg" onClick={() => { setStep(1); setPreviewDates([]); }}>Tạo lịch định kỳ khác</Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default RecurringBooking;
