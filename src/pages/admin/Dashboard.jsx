import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Table, Badge, Button } from 'react-bootstrap';
import adminService from '../../services/adminService';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';

Chart.register(...registerables);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false); // Mặc định là chế độ Sáng
    const revenueChartRef = useRef(null);
    const statusChartRef = useRef(null);
    const revenueChartInst = useRef(null);
    const statusChartInst = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        if (!loading && stats) {
            renderCharts();
        }
    }, [loading, stats, isDarkMode]);

    const renderCharts = () => {
        if (revenueChartInst.current) revenueChartInst.current.destroy();
        if (statusChartInst.current) statusChartInst.current.destroy();

        const colorText = isDarkMode ? '#f8fafc' : '#0f172a';
        const colorGrid = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

        const ctxRev = revenueChartRef.current.getContext('2d');
        const revLabels = stats.revenue_by_day?.slice().reverse().map(item => {
            const date = new Date(item.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }) || ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
        const revData = stats.revenue_by_day?.slice().reverse().map(item => parseInt(item.revenue)) || [1200000, 1900000, 1500000, 2500000, 2200000, 3000000];

        revenueChartInst.current = new Chart(ctxRev, {
            type: 'line',
            data: {
                labels: revLabels,
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: revData,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: colorGrid },
                        ticks: { color: colorText }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: colorText }
                    }
                }
            }
        });

        const ctxStatus = statusChartRef.current.getContext('2d');
        const statusLabels = stats.bookings_by_status?.map(item => {
            const labels = {
                'Pending': 'Chờ',
                'Partially Paid': 'Cọc',
                'Confirmed': 'Đã đặt',
                'Cancelled': 'Hủy',
                'Completed': 'Xong',
                'Active': 'Chạy'
            };
            return labels[item.status] || item.status;
        }) || ['Chờ', 'Đã đặt', 'Hủy', 'Hoàn thành'];
        const statusValues = stats.bookings_by_status?.map(item => parseInt(item.count)) || [10, 25, 5, 40];

        statusChartInst.current = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusValues,
                    backgroundColor: ['#3b82f6', '#00ff88', '#ef4444', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'bottom',
                        labels: { color: colorText }
                    } 
                }
            }
        });
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('light-theme');
    };

    if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

    const overview = stats?.overview || {};

    return (
        <div className={`dashboard-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
            <div className="dashboard-content p-4">
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Hệ Thống Quản Trị</h2>
                        <p className="text-muted small mb-0">Chào mừng trở lại, Admin!</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" onClick={toggleTheme} id="theme-toggle-btn">
                            <i className={`bi bi-${isDarkMode ? 'sun' : 'moon-stars'}`}></i>
                        </Button>
                    </div>
                </header>

                <div className="stats-grid mb-4">
                    <div className="premium-card" id="card-bookings">
                        <div className="card-icon blue"><i className="bi bi-calendar-check"></i></div>
                        <div className="card-info">
                            <h3>{overview.total_bookings || 0}</h3>
                            <p>Tổng Đặt Sân</p>
                        </div>
                    </div>
                    <div className="premium-card" id="card-revenue">
                        <div className="card-icon green"><i className="bi bi-currency-dollar"></i></div>
                        <div className="card-info">
                            <h3>{(overview.total_revenue || 0).toLocaleString()} ₫</h3>
                            <p>Doanh Thu</p>
                        </div>
                    </div>
                    <div className="premium-card" id="card-users">
                        <div className="card-icon purple"><i className="bi bi-people"></i></div>
                        <div className="card-info">
                            <h3>{overview.total_users || 0}</h3>
                            <p>Người Dùng</p>
                        </div>
                    </div>
                    <div className="premium-card" id="card-courts">
                        <div className="card-icon orange"><i className="bi bi-grid-3x3-gap"></i></div>
                        <div className="card-info">
                            <h3>{overview.total_courts || 0}</h3>
                            <p>Sân Hoạt Động</p>
                        </div>
                    </div>
                </div>

                <Row className="mb-4">
                    <Col lg={8} className="mb-3 mb-lg-0">
                        <div className="premium-container h-100">
                            <h5 className="mb-4">Xu Hướng Doanh Thu</h5>
                            <div className="chart-wrapper">
                                <canvas ref={revenueChartRef} id="revenue-canvas"></canvas>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="premium-container h-100">
                            <h5 className="mb-4">Phân Bổ Trạng Thái</h5>
                            <div className="chart-wrapper">
                                <canvas ref={statusChartRef} id="status-canvas"></canvas>
                            </div>
                        </div>
                    </Col>
                </Row>

                <div className="premium-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Giao Dịch Gần Đây</h5>
                        <Button variant="link" className="p-0 text-decoration-none">Xem tất cả</Button>
                    </div>
                    <Table responsive hover className="premium-table" id="transactions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người dùng</th>
                                <th>Thời gian</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_bookings?.map(booking => (
                                <tr key={booking.id}>
                                    <td>#BK-{booking.id}</td>
                                    <td>{booking.username}</td>
                                    <td>{new Date(booking.booking_date).toLocaleDateString('vi-VN')} {booking.start_time}</td>
                                    <td>{parseInt(booking.total_price).toLocaleString()} ₫</td>
                                    <td>
                                        <Badge bg={
                                            booking.status === 'Completed' ? 'success' :
                                            booking.status === 'Pending' ? 'warning' :
                                            booking.status === 'Cancelled' ? 'danger' :
                                            booking.status === 'Partially Paid' ? 'info' : 'secondary'
                                        }>
                                            {booking.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {(!stats.recent_bookings || stats.recent_bookings.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">Chưa có giao dịch nào</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
