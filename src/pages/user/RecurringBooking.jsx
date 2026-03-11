import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { BiCalendar, BiRepeat, BiCheck, BiTrash } from 'react-icons/bi';

const courts = [
    { id: 1, name: 'Sân 1' }, { id: 2, name: 'Sân 2' }, { id: 3, name: 'Sân 3 (VIP)' },
    { id: 4, name: 'Sân 4' }, { id: 5, name: 'Sân 5' },
];

const weekdays = [
    { key: 1, label: 'T2' }, { key: 2, label: 'T3' }, { key: 3, label: 'T4' },
    { key: 4, label: 'T5' }, { key: 5, label: 'T6' }, { key: 6, label: 'T7' }, { key: 0, label: 'CN' },
];

const priceByHour = (h) => h >= 17 && h < 21 ? 170000 : 120000;
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

    const [form, setForm] = useState({
        startDate: today,
        endDate: nextMonthStr,
        selectedDays: [1, 3, 5], // T2, T4, T6
        startHour: 17,
        duration: 1,
        courtId: 1,
        name: '',
        phone: '',
    });
    const [step, setStep] = useState(1); // 1: form, 2: preview, 3: done
    const [previewDates, setPreviewDates] = useState([]);

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

    const totalPrice = previewDates.length * form.duration * priceByHour(form.startHour);

    return (
        <Container fluid className="py-4">
            <div className="d-flex align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiRepeat className="me-2 text-primary" />Đặt sân định kỳ</h2>
                    <p className="text-muted mb-0">Đặt sân cố định theo lịch hàng tuần (VD: T2-T4-T6 mỗi tuần)</p>
                </div>
            </div>

            {step === 3 && (
                <Alert variant="success">
                    <BiCheck className="me-2" />
                    <strong>Đặt lịch định kỳ thành công!</strong> Đã tạo {previewDates.length} lịch đặt sân. Hệ thống đã gửi email xác nhận.
                </Alert>
            )}

            {/* Step Indicator */}
            <div className="d-flex align-items-center mb-4">
                {['Chọn lịch', 'Xem trước', 'Xác nhận'].map((s, i) => (
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
                            <Card.Header className="bg-white fw-bold">Chọn khoảng thời gian</Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Label>Từ ngày</Form.Label>
                                        <Form.Control type="date" min={today} value={form.startDate}
                                            onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>Đến ngày</Form.Label>
                                        <Form.Control type="date" min={form.startDate} value={form.endDate}
                                            onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">Chọn các thứ trong tuần</Card.Header>
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
                                {form.selectedDays.length === 0 && <small className="text-danger mt-2 d-block">Vui lòng chọn ít nhất 1 ngày</small>}
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm mb-3">
                            <Card.Header className="bg-white fw-bold">Giờ chơi & Sân</Card.Header>
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
                                        <Form.Label>Thời lượng</Form.Label>
                                        <Form.Select value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}>
                                            {[1, 2, 3].map(d => <option key={d} value={d}>{d} giờ</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Sân ưu tiên</Form.Label>
                                        <Form.Select value={form.courtId} onChange={e => setForm({ ...form, courtId: +e.target.value })}>
                                            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <Card.Header className="bg-white fw-bold">Thông tin liên hệ</Card.Header>
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Label>Họ tên <span className="text-danger">*</span></Form.Label>
                                        <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Label>SĐT <span className="text-danger">*</span></Form.Label>
                                        <Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="09xxxxxxxx" />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: 20 }}>
                            <Card.Header className="bg-primary text-white fw-bold">Tóm tắt</Card.Header>
                            <Card.Body>
                                <div className="mb-2 small"><strong>Từ:</strong> {new Date(form.startDate).toLocaleDateString('vi-VN')}</div>
                                <div className="mb-2 small"><strong>Đến:</strong> {new Date(form.endDate).toLocaleDateString('vi-VN')}</div>
                                <div className="mb-2 small"><strong>Các thứ:</strong> {form.selectedDays.map(d => weekdays.find(w => w.key === d)?.label).join(', ') || '—'}</div>
                                <div className="mb-2 small"><strong>Giờ:</strong> {form.startHour}:00 – {form.startHour + form.duration}:00</div>
                                <div className="mb-2 small"><strong>Sân:</strong> {courts.find(c => c.id === form.courtId)?.name}</div>
                                <hr />
                                <div className="small text-muted">Dự kiến ~{generateDates(form.startDate, form.endDate, form.selectedDays).length} buổi</div>
                                <Button className="w-100 mt-3" onClick={handlePreview}
                                    disabled={form.selectedDays.length === 0 || !form.name || !form.phone}>
                                    Xem trước lịch →
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
                                <span className="fw-bold">Danh sách lịch dự kiến ({previewDates.length} buổi)</span>
                                <Badge bg="primary">{previewDates.length} lịch</Badge>
                            </Card.Header>
                            <Card.Body style={{ maxHeight: 420, overflowY: 'auto' }}>
                                <Row className="g-2">
                                    {previewDates.map((date, i) => (
                                        <Col md={6} key={i}>
                                            <div className="d-flex align-items-center gap-2 p-2 border rounded small">
                                                <BiCalendar className="text-primary" />
                                                <div>
                                                    <div className="fw-bold">{new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}</div>
                                                    <div className="text-muted">{form.startHour}:00 – {form.startHour + form.duration}:00 | {courts.find(c => c.id === form.courtId)?.name}</div>
                                                </div>
                                                <Badge bg="success" className="ms-auto">{fmt(form.duration * priceByHour(form.startHour))}</Badge>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: 20 }}>
                            <Card.Header className="bg-primary text-white fw-bold">Xác nhận đặt lịch</Card.Header>
                            <Card.Body>
                                <div className="mb-2 small"><strong>Khách:</strong> {form.name}</div>
                                <div className="mb-2 small"><strong>SĐT:</strong> {form.phone}</div>
                                <div className="mb-2 small"><strong>Số buổi:</strong> {previewDates.length}</div>
                                <div className="mb-2 small"><strong>Giờ/buổi:</strong> {form.startHour}:00 – {form.startHour + form.duration}:00</div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Tổng cộng:</span>
                                    <strong className="text-primary fs-5">{fmt(totalPrice)}</strong>
                                </div>
                                <Button className="w-100 mb-2" onClick={() => setStep(3)}>
                                    <BiCheck className="me-2" />Xác nhận đặt {previewDates.length} lịch
                                </Button>
                                <Button variant="outline-secondary" className="w-100" onClick={() => setStep(1)}>
                                    ← Quay lại
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {step === 3 && (
                <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center py-5">
                        <div style={{ fontSize: 60 }}>🎉</div>
                        <h4 className="fw-bold mt-3">Đặt lịch định kỳ thành công!</h4>
                        <p className="text-muted">Đã tạo {previewDates.length} lịch đặt sân. Email xác nhận đã được gửi đến bạn.</p>
                        <Button variant="primary" onClick={() => { setStep(1); setPreviewDates([]); }}>Đặt lịch mới</Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default RecurringBooking;
