import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { BiDownload, BiFileBlank, BiCheck } from 'react-icons/bi';

const reportTemplates = [
    { id: 1, name: 'Báo cáo doanh thu tháng', type: 'revenue', desc: 'Tổng doanh thu, lợi nhuận, chi phí theo tháng', icon: '💰' },
    { id: 2, name: 'Báo cáo hiệu suất sân', type: 'performance', desc: 'Occupancy, lượt đặt, sự cố từng sân', icon: '🏸' },
    { id: 3, name: 'Báo cáo khách hàng', type: 'customers', desc: 'Top khách hàng, tần suất đặt, doanh thu từ khách', icon: '👥' },
    { id: 4, name: 'Báo cáo đặt sân chi tiết', type: 'bookings', desc: 'Danh sách toàn bộ booking theo khoảng thời gian', icon: '📅' },
    { id: 5, name: 'Báo cáo thanh toán', type: 'payments', desc: 'Phương thức thanh toán, tỷ lệ nợ, đặt cọc', icon: '💳' },
    { id: 6, name: 'Báo cáo nhân viên', type: 'staff', desc: 'Hiệu suất nhân viên, ca làm việc, check-in xử lý', icon: '👷' },
];

const formatOptions = ['PDF', 'Excel (.xlsx)', 'CSV'];

const ReportGenerator = () => {
    const [form, setForm] = useState({
        template: '',
        from: '',
        to: '',
        format: 'PDF',
        includeCharts: true,
        includeSummary: true,
    });
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState('');
    const [recentReports] = useState([
        { name: 'Báo cáo doanh thu T2/2026', date: '2026-03-01', format: 'PDF', size: '2.4 MB' },
        { name: 'Báo cáo hiệu suất sân T2/2026', date: '2026-03-01', format: 'Excel', size: '1.1 MB' },
        { name: 'Báo cáo khách hàng Q4/2025', date: '2026-01-05', format: 'PDF', size: '3.7 MB' },
    ]);

    const handleGenerate = () => {
        if (!form.template || !form.from || !form.to) return;
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            const tmpl = reportTemplates.find(t => t.id === +form.template);
            setDone(`✅ Đã tạo "${tmpl?.name}" — ${form.format} sẵn sàng tải về!`);
            setTimeout(() => setDone(''), 5000);
        }, 1800);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1"><BiFileBlank className="me-2 text-primary" />Tạo báo cáo</h2>
                    <p className="text-muted mb-0">Tạo và xuất báo cáo tùy chỉnh theo khoảng thời gian</p>
                </div>
            </div>

            {done && <Alert variant="success" onClose={() => setDone('')} dismissible>{done}</Alert>}

            <Row className="g-4">
                <Col md={7}>
                    {/* Template chooser */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white fw-bold">1. Chọn loại báo cáo</Card.Header>
                        <Card.Body>
                            <Row className="g-2">
                                {reportTemplates.map(t => (
                                    <Col md={6} key={t.id}>
                                        <div
                                            className={`p-3 rounded border cursor-pointer ${form.template === String(t.id) ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => setForm({ ...form, template: String(t.id) })}
                                        >
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span style={{ fontSize: 20 }}>{t.icon}</span>
                                                <strong className="small">{t.name}</strong>
                                                {form.template === String(t.id) && <BiCheck className="text-primary ms-auto" />}
                                            </div>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{t.desc}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white fw-bold">2. Khoảng thời gian</Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={4}>
                                    <div className="d-flex gap-2 mb-3">
                                        {[['week', 'Tuần này'], ['month', 'Tháng này'], ['quarter', 'Quý này']].map(([v, l]) => (
                                            <Button key={v} size="sm" variant="outline-secondary"
                                                onClick={() => {
                                                    const now = new Date();
                                                    const from = new Date();
                                                    if (v === 'week') from.setDate(now.getDate() - 7);
                                                    else if (v === 'month') from.setMonth(now.getMonth() - 1);
                                                    else from.setMonth(now.getMonth() - 3);
                                                    setForm({ ...form, from: from.toISOString().split('T')[0], to: today });
                                                }}>
                                                {l}
                                            </Button>
                                        ))}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Row className="g-2">
                                        <Col>
                                            <Form.Label className="small">Từ ngày</Form.Label>
                                            <Form.Control type="date" value={form.from} max={form.to || today}
                                                onChange={e => setForm({ ...form, from: e.target.value })} />
                                        </Col>
                                        <Col>
                                            <Form.Label className="small">Đến ngày</Form.Label>
                                            <Form.Control type="date" value={form.to} min={form.from} max={today}
                                                onChange={e => setForm({ ...form, to: e.target.value })} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">3. Tuỳ chọn xuất</Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={5}>
                                    <Form.Label className="small">Định dạng file</Form.Label>
                                    <div className="d-flex gap-2">
                                        {formatOptions.map(f => (
                                            <Button key={f} size="sm"
                                                variant={form.format === f ? 'primary' : 'outline-secondary'}
                                                onClick={() => setForm({ ...form, format: f })}>
                                                {f}
                                            </Button>
                                        ))}
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <Form.Label className="small">Bao gồm</Form.Label>
                                    <div className="d-flex gap-3">
                                        <Form.Check label="Biểu đồ" checked={form.includeCharts}
                                            onChange={e => setForm({ ...form, includeCharts: e.target.checked })} />
                                        <Form.Check label="Tóm tắt" checked={form.includeSummary}
                                            onChange={e => setForm({ ...form, includeSummary: e.target.checked })} />
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="border-0 shadow-sm mb-4 sticky-top" style={{ top: 20 }}>
                        <Card.Header className="bg-primary text-white fw-bold">Xem trước & Tạo báo cáo</Card.Header>
                        <Card.Body>
                            {form.template ? (
                                <>
                                    <div className="mb-3">
                                        <div className="small text-muted mb-1">Loại báo cáo:</div>
                                        <strong>{reportTemplates.find(t => t.id === +form.template)?.icon} {reportTemplates.find(t => t.id === +form.template)?.name}</strong>
                                    </div>
                                    <div className="mb-3 small">
                                        <div className="text-muted mb-1">Khoảng thời gian:</div>
                                        {form.from && form.to ? (
                                            <strong>{new Date(form.from).toLocaleDateString('vi-VN')} → {new Date(form.to).toLocaleDateString('vi-VN')}</strong>
                                        ) : <span className="text-warning">Chưa chọn</span>}
                                    </div>
                                    <div className="mb-3 small">
                                        <div className="text-muted mb-1">Định dạng:</div>
                                        <Badge bg="info">{form.format}</Badge>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-3 text-muted small">Chọn loại báo cáo để xem trước</div>
                            )}
                            <Button className="w-100" variant="primary" onClick={handleGenerate}
                                disabled={!form.template || !form.from || !form.to || generating}>
                                {generating ? (
                                    <><span className="spinner-border spinner-border-sm me-2" />Đang tạo...</>
                                ) : (
                                    <><BiDownload className="me-2" />Tạo & Tải báo cáo</>
                                )}
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Báo cáo gần đây</Card.Header>
                        <Card.Body className="p-0">
                            {recentReports.map((r, i) => (
                                <div key={i} className="d-flex align-items-center gap-3 p-3 border-bottom">
                                    <BiFileBlank size={24} className="text-primary flex-shrink-0" />
                                    <div className="flex-grow-1 min-width-0">
                                        <div className="fw-bold small text-truncate">{r.name}</div>
                                        <div className="text-muted small">{r.date} · {r.format} · {r.size}</div>
                                    </div>
                                    <Button size="sm" variant="outline-primary"><BiDownload /></Button>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportGenerator;
