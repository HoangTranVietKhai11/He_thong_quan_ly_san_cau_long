import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { BiBuilding } from 'react-icons/bi';

const FloorPlan = () => {
    // Improved 2D floor plan with better spacing
    const courts = [
        // Hàng 1: 4 sân
        { id: 1, x: 40, y: 130, status: 'available' },
        { id: 2, x: 220, y: 130, status: 'available' },
        { id: 3, x: 400, y: 130, status: 'in_use' },
        { id: 4, x: 580, y: 130, status: 'available' },
        // Hàng 2: 4 sân
        { id: 5, x: 40, y: 310, status: 'available' },
        { id: 6, x: 220, y: 310, status: 'maintenance' },
        { id: 7, x: 400, y: 310, status: 'available' },
        { id: 8, x: 580, y: 310, status: 'in_use' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            available: '#28a745',
            in_use: '#ffc107',
            maintenance: '#dc3545',
            closed: '#6c757d'
        };
        return colors[status] || '#6c757d';
    };

    const getStatusLabel = (status) => {
        const labels = {
            available: 'Sẵn sàng',
            in_use: 'Đang sử dụng',
            maintenance: 'Bảo trì',
            closed: 'Đóng cửa'
        };
        return labels[status] || 'Không xác định';
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Sơ đồ mặt bằng</h2>
                <p className="text-muted">Xem sơ đồ 2D và vị trí các sân</p>
            </div>

            <Row>
                <Col lg={9}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0 fw-bold">Mặt bằng sân cầu lông</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* SVG Floor Plan - Redesigned with better layout */}
                            <svg width="100%" height="600" viewBox="0 0 800 550" style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                                {/* Main building outline */}
                                <rect x="10" y="10" width="780" height="530" fill="white" stroke="#6c757d" strokeWidth="3" rx="10" />

                                {/* Entrance */}
                                <rect x="340" y="10" width="120" height="30" fill="#0d6efd" rx="5" />
                                <text x="400" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                                    LỐI VÀO
                                </text>

                                {/* Reception area */}
                                <rect x="280" y="50" width="240" height="60" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" rx="8" />
                                <text x="400" y="85" textAnchor="middle" fill="#495057" fontSize="16" fontWeight="bold">
                                    QUẦY LỄ TÂN
                                </text>

                                {/* Hallway line */}
                                <line x1="30" y1="120" x2="770" y2="120" stroke="#dee2e6" strokeWidth="2" strokeDasharray="5,5" />

                                {/* Courts - 2 rows of 4 */}
                                {courts.map((court) => (
                                    <g key={court.id}>
                                        {/* Court rectangle */}
                                        <rect
                                            x={court.x}
                                            y={court.y}
                                            width="160"
                                            height="160"
                                            fill={getStatusColor(court.status)}
                                            fillOpacity="0.15"
                                            stroke={getStatusColor(court.status)}
                                            strokeWidth="4"
                                            rx="10"
                                        />

                                        {/* Inner court lines (badminton net) */}
                                        <line
                                            x1={court.x + 80}
                                            y1={court.y + 20}
                                            x2={court.x + 80}
                                            y2={court.y + 140}
                                            stroke={getStatusColor(court.status)}
                                            strokeWidth="2"
                                            opacity="0.5"
                                        />

                                        {/* Court number */}
                                        <text
                                            x={court.x + 80}
                                            y={court.y + 75}
                                            textAnchor="middle"
                                            fontSize="28"
                                            fontWeight="bold"
                                            fill={getStatusColor(court.status)}
                                        >
                                            SÂN {court.id}
                                        </text>

                                        {/* Status label */}
                                        <text
                                            x={court.x + 80}
                                            y={court.y + 105}
                                            textAnchor="middle"
                                            fontSize="13"
                                            fill="#495057"
                                            fontWeight="500"
                                        >
                                            {getStatusLabel(court.status)}
                                        </text>

                                        {/* Small corner badge */}
                                        <circle
                                            cx={court.x + 145}
                                            cy={court.y + 15}
                                            r="8"
                                            fill={getStatusColor(court.status)}
                                        />
                                    </g>
                                ))}

                                {/* Row labels */}
                                <text x="15" y="210" fontSize="14" fontWeight="bold" fill="#6c757d">HÀNG 1</text>
                                <text x="15" y="390" fontSize="14" fontWeight="bold" fill="#6c757d">HÀNG 2</text>
                            </svg>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3}>
                    {/* Legend */}
                    <Card className="border-0 shadow-sm mb-3">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0 fw-bold">Chú thích</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', marginRight: '10px', borderRadius: '4px' }}></div>
                                    <span>Sẵn sàng</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#ffc107', marginRight: '10px', borderRadius: '4px' }}></div>
                                    <span>Đang sử dụng</span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#dc3545', marginRight: '10px', borderRadius: '4px' }}></div>
                                    <span>Bảo trì</span>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex align-items-center">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#6c757d', marginRight: '10px', borderRadius: '4px' }}></div>
                                    <span>Đóng cửa</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0 fw-bold">Thống kê nhanh</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <small className="text-muted d-block">Tổng số sân</small>
                                <h4 className="fw-bold mb-0">8 sân</h4>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Sân sẵn sàng</small>
                                <h4 className="fw-bold mb-0 text-success">
                                    {courts.filter(c => c.status === 'available').length} sân
                                </h4>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Đang sử dụng</small>
                                <h4 className="fw-bold mb-0 text-warning">
                                    {courts.filter(c => c.status === 'in_use').length} sân
                                </h4>
                            </div>
                            <div>
                                <small className="text-muted d-block">Bảo trì</small>
                                <h4 className="fw-bold mb-0 text-danger">
                                    {courts.filter(c => c.status === 'maintenance').length} sân
                                </h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FloorPlan;
