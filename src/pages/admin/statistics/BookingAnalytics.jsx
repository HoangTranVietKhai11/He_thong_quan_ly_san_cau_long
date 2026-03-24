import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import adminStatsService from '../../../services/adminStatsService';
import { BiCalendar, BiUser, BiTime, BiTrendingUp } from 'react-icons/bi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const BookingAnalytics = () => {
    const [hourlyData, setHourlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [trendsData, setTrendsData] = useState(null);
    const [predictedHours, setPredictedHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [hourly, weekly, customers, trends, predictions] = await Promise.all([
                    adminStatsService.getHourlyDistribution(),
                    adminStatsService.getWeeklyDistribution(),
                    adminStatsService.getTopCustomers(5),
                    adminStatsService.getTrends(),
                    adminStatsService.getPredictedGoldenHours()
                ]);
                setHourlyData(hourly.data?.data || []);
                setWeeklyData(weekly.data?.data || []);
                setTopCustomers(customers.data?.data || []);
                setTrendsData(trends.data?.data || null);
                setPredictedHours(predictions.data?.data || []);
            } catch (err) {
                setError('Không thể tải dữ liệu phân tích: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

    const hourlyChartData = {
        labels: hourlyData.map(d => `${d.hour}h`),
        datasets: [{
            label: 'Số lượt đặt',
            data: hourlyData.map(d => d.count),
            backgroundColor: hourlyData.map(d => {
                const isPredicted = predictedHours.some(p => p.hour === d.hour);
                return isPredicted ? 'rgba(220, 53, 69, 0.8)' : // Đỏ đậm cho giờ dự đoán
                    d.hour >= 7 && d.hour <= 10 ? 'rgba(255, 193, 7, 0.7)' :
                    'rgba(13, 110, 253, 0.5)';
            }),
            borderRadius: 6,
        }]
    };

    const weeklyChartData = {
        labels: weeklyData.map(d => d.day),
        datasets: [{
            label: 'Lượt đặt',
            data: weeklyData.map(d => d.count),
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)', 'rgba(255, 159, 64, 0.7)',
                'rgba(255, 205, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)', 'rgba(153, 102, 255, 0.7)',
                'rgba(201, 203, 207, 0.7)'
            ],
            borderRadius: 6,
        }]
    };

    const statusData = trendsData?.booking_status_breakdown || [];
    const statusColors = {
        'Confirmed': 'rgba(13, 202, 240, 0.8)', 'Completed': 'rgba(25, 135, 84, 0.8)',
        'Cancelled': 'rgba(220, 53, 69, 0.8)', 'Active': 'rgba(255, 193, 7, 0.8)',
        'Fully Paid': 'rgba(100, 220, 100, 0.8)',
    };
    const statusChartData = {
        labels: statusData.map(s => s.status),
        datasets: [{
            data: statusData.map(s => parseInt(s.count)),
            backgroundColor: statusData.map(s => statusColors[s.status] || 'rgba(200, 200, 200, 0.8)'),
        }]
    };

    const totalBookings = statusData.reduce((s, d) => s + parseInt(d.count), 0);
    const confirmedBookings = statusData.find(s => s.status === 'Confirmed')?.count || 0;
    const cancelledBookings = statusData.find(s => s.status === 'Cancelled')?.count || 0;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">📊 Phân tích đặt sân</h2>
                <Badge bg="info" className="p-2">
                    <BiTrendingUp className="me-1" /> Dữ liệu 30 ngày gần nhất
                </Badge>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Prediction Card */}
            <Card className="border-0 shadow-sm mb-4 bg-light border-start border-4 border-primary">
                <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                        <div className="bg-primary text-white rounded-circle p-2 me-3">
                            <BiTrendingUp size={24} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0">Dự đoán & Gợi ý Khung giờ vàng</h5>
                            <p className="text-muted small mb-0">Dựa trên tỉ lệ lấp sân thực tế của hệ thống</p>
                        </div>
                    </div>
                    <hr />
                    <Row className="g-3">
                        {predictedHours.length > 0 ? (
                            predictedHours.slice(0, 4).map((p, i) => (
                                <Col md={3} key={i}>
                                    <div className="bg-white p-3 rounded shadow-sm border-top border-3 border-danger">
                                        <div className="fw-bold text-danger">{p.hour}:00 - {p.hour + 1}:00</div>
                                        <div className="small text-muted">Tỉ lệ lấp đầy: <strong>{p.occupancy}%</strong></div>
                                        <Badge bg="danger" className="mt-2">Đề xuất giờ vàng</Badge>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <div className="text-muted small italic text-center py-2">
                                    Chưa có đủ dữ liệu để đưa ra dự đoán chính xác.
                                </div>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>

            {/* Summary Cards */}
            <Row className="mb-4 g-3">
                {[
                    { label: 'Tổng đặt sân', value: totalBookings, icon: <BiCalendar />, color: 'primary' },
                    { label: 'Đang xác nhận', value: confirmedBookings, icon: <BiCalendar />, color: 'info' },
                    { label: 'Đã hủy', value: cancelledBookings, icon: <BiCalendar />, color: 'danger' },
                    { label: 'Top KH đặt nhiều', value: topCustomers[0]?.username || '—', icon: <BiUser />, color: 'success' }
                ].map((s, i) => (
                    <Col md={3} key={i}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="d-flex align-items-center">
                                <div className={`text-${s.color} me-3`} style={{ fontSize: '2rem' }}>{s.icon}</div>
                                <div>
                                    <div className="text-muted small">{s.label}</div>
                                    <h4 className="fw-bold mb-0">{s.value}</h4>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mb-4 g-3">
                {/* Hourly Distribution */}
                <Col md={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <h5 className="fw-bold mb-3"><BiTime className="me-2 text-primary" />Phân phối lượt đặt theo giờ</h5>
                            <p className="text-muted small">Đỏ = Gợi ý giờ vàng (Dự đoán), Vàng = Giờ sáng, Xanh = Bình thường</p>
                            {hourlyData.length > 0
                                ? <Bar data={hourlyChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                                : <div className="text-center text-muted py-4">Chưa có dữ liệu</div>
                            }
                        </Card.Body>
                    </Card>
                </Col>

                {/* Status Breakdown */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Trạng thái đặt sân</h5>
                            {statusData.length > 0
                                ? <Doughnut data={statusChartData} options={{ responsive: true, cutout: '65%' }} />
                                : <div className="text-center text-muted py-4">Chưa có dữ liệu</div>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3">
                {/* Weekly Distribution */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="fw-bold mb-3"><BiTrendingUp className="me-2 text-success" />Phân phối theo ngày trong tuần</h5>
                            {weeklyData.length > 0
                                ? <Bar data={weeklyChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                                : <div className="text-center text-muted py-4">Chưa có dữ liệu</div>
                            }
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top Customers */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="fw-bold mb-3"><BiUser className="me-2 text-warning" />Top 5 Khách hàng thân thiết</h5>
                            {topCustomers.length > 0 ? (
                                <div>
                                    {topCustomers.map((c, i) => (
                                        <div key={c.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    style={{ width: 36, height: 36, borderRadius: '50%', background: ['#0d6efd','#198754','#ffc107','#dc3545','#6f42c1'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', marginRight: '12px', flexShrink: 0 }}
                                                >
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{c.username}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{c.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold small text-primary">{c.booking_count} lần</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{formatPrice(c.total_spent)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-4">Chưa có dữ liệu khách hàng</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingAnalytics;
