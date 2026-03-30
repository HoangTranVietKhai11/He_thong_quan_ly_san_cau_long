import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Form, Row, Col, OverlayTrigger, Tooltip, Modal, Alert, Spinner } from 'react-bootstrap';
import { BiBuilding, BiMapPin, BiX } from 'react-icons/bi';
import { FiInfo } from 'react-icons/fi';
import courtService from '../../../services/courtService';

const FloorPlan = () => {
    const [courtStatuses, setCourtStatuses] = useState([]);
    const [courtLayout, setCourtLayout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoading(true);
                const response = await courtService.getCourts();
                const courts = response.courts || response.data || [];
                
                // Tự động sắp xếp sân thành các hàng 4
                const layout = [];
                for (let i = 0; i < courts.length; i += 4) {
                    layout.push(courts.slice(i, i + 4).map(c => c.id));
                }
                setCourtLayout(layout);

                // Map dữ liệu sân cho UI
                const statuses = courts.map(c => ({
                    courtId: c.id,
                    name: c.name || `Sân ${c.id}`,
                    status: c.status?.toLowerCase() === 'maintenance' ? 'maintenance' : 'available',
                    currentBooking: null // Chưa nối realtime booking, tạm coi là trống
                }));
                setCourtStatuses(statuses);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu sơ đồ sân:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourts();
    }, []);

    const getStatusColor = (status) => ({
        available: '#28a745',
        in_use: '#ffc107',
        maintenance: '#dc3545',
        closed: '#6c757d'
    }[status] || '#6c757d');

    const getStatusLabel = (status) => ({
        available: 'Sẵn sàng',
        in_use: 'Đang sử dụng',
        maintenance: 'Bảo trì',
        closed: 'Đóng cửa'
    }[status] || 'Không xác định');

    const getStatusBg = (status) => ({
        available: 'rgba(40,167,69,0.1)',
        in_use: 'rgba(255,193,7,0.15)',
        maintenance: 'rgba(220,53,69,0.12)',
        closed: 'rgba(108,117,125,0.12)'
    }[status] || 'rgba(108,117,125,0.1)');

    const handleCourtClick = (courtId) => {
        const courtData = courtStatuses.find(c => c.courtId === courtId);
        setSelectedCourt(courtData);
        setShowDetailModal(true);
    };

    const handleStatusChange = (courtId, newStatus) => {
        setCourtStatuses(courtStatuses.map(c =>
            c.courtId === courtId ? { ...c, status: newStatus } : c
        ));
        if (selectedCourt?.courtId === courtId) {
            setSelectedCourt(prev => ({ ...prev, status: newStatus }));
        }
    };

    const stats = {
        available: courtStatuses.filter(c => c.status === 'available').length,
        in_use: courtStatuses.filter(c => c.status === 'in_use').length,
        maintenance: courtStatuses.filter(c => c.status === 'maintenance').length,
        closed: courtStatuses.filter(c => c.status === 'closed').length,
    };

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Sơ đồ mặt bằng</h2>
                <p className="text-muted">Xem sơ đồ 2D và click vào sân để xem chi tiết / trạng thái thời gian thực</p>
            </div>

            <Row>
                <Col lg={9}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">🏟️ Mặt bằng sân cầu lông</h5>
                            <small className="text-muted">Click vào sân để xem chi tiết</small>
                        </Card.Header>
                        <Card.Body className="position-relative">
                            {loading && (
                                <div className="position-absolute top-50 start-50 translate-middle z-1">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            )}
                            <svg width="100%" height={Math.max(600, 150 + courtLayout.length * 200)} viewBox={`0 0 820 ${Math.max(560, 150 + courtLayout.length * 200)}`}
                                style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>

                                {/* Building border */}
                                <rect x="10" y="10" width="800" height={Math.max(540, 130 + courtLayout.length * 200)} fill="white" stroke="#6c757d" strokeWidth="3" rx="10" />

                                {/* Entrance */}
                                <rect x="340" y="10" width="140" height="32" fill="#0d6efd" rx="5" />
                                <text x="410" y="30" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">LỐI VÀO</text>

                                {/* Reception */}
                                <rect x="280" y="50" width="260" height="55" fill="#e9ecef" stroke="#adb5bd" strokeWidth="2" rx="8" />
                                <text x="410" y="83" textAnchor="middle" fill="#495057" fontSize="15" fontWeight="bold">QUẦY LỄ TÂN</text>

                                {/* Divider */}
                                <line x1="30" y1="118" x2="790" y2="118" stroke="#dee2e6" strokeWidth="2" strokeDasharray="6,4" />
                                <text x="15" y="115" fontSize="11" fill="#adb5bd">Hành lang</text>

                                {/* ROW 1 label */}
                                <text x="18" y="210" fontSize="13" fontWeight="bold" fill="#6c757d" transform="rotate(-90 18 210)">HÀNG 1</text>

                                {/* ROW 2 label */}
                                <text x="18" y="400" fontSize="13" fontWeight="bold" fill="#6c757d" transform="rotate(-90 18 400)">HÀNG 2</text>

                                {/* Courts */}
                                {courtLayout.map((row, rowIdx) =>
                                    row.map((courtId, colIdx) => {
                                        const courtData = courtStatuses.find(c => c.courtId === courtId);
                                        if (!courtData) return null;
                                        const x = 40 + colIdx * 190;
                                        const y = 130 + rowIdx * 195;
                                        const color = getStatusColor(courtData.status);
                                        const bgFill = getStatusBg(courtData.status);
                                        const isOccupied = courtData.status === 'in_use';

                                        return (
                                            <g
                                                key={courtId}
                                                onClick={() => handleCourtClick(courtId)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {/* Court box */}
                                                <rect
                                                    x={x} y={y} width="172" height="170"
                                                    fill={bgFill}
                                                    stroke={color}
                                                    strokeWidth={isOccupied ? 3 : 2}
                                                    rx="10"
                                                />

                                                {/* Net line */}
                                                <line x1={x + 86} y1={y + 20} x2={x + 86} y2={y + 150}
                                                    stroke={color} strokeWidth="2" opacity="0.5" />

                                                {/* Court boundary lines */}
                                                <rect x={x + 12} y={y + 18} width="148" height="134"
                                                    fill="none" stroke={color} strokeWidth="1" opacity="0.3" rx="2" />

                                                {/* Court number/name */}
                                                <text x={x + 86} y={y + 70} textAnchor="middle"
                                                    fontSize="20" fontWeight="bold" fill={color}>
                                                    {courtData.name?.toUpperCase() || `SÂN ${courtId}`}
                                                </text>

                                                {/* Status label */}
                                                <text x={x + 86} y={y + 95} textAnchor="middle"
                                                    fontSize="12" fill="#495057" fontWeight="500">
                                                    {getStatusLabel(courtData.status)}
                                                </text>

                                                {/* If occupied: show customer name */}
                                                {isOccupied && courtData.currentBooking && (
                                                    <>
                                                        <rect x={x + 10} y={y + 108} width="152" height="40" fill={color} fillOpacity="0.15" rx="5" />
                                                        <text x={x + 86} y={y + 122} textAnchor="middle" fontSize="10" fill="#343a40" fontWeight="600">
                                                            {courtData.currentBooking.customerName}
                                                        </text>
                                                        <text x={x + 86} y={y + 138} textAnchor="middle" fontSize="10" fill="#6c757d">
                                                            {courtData.currentBooking.startTime} - {courtData.currentBooking.endTime}
                                                        </text>
                                                    </>
                                                )}

                                                {/* Occupied badge dot */}
                                                {isOccupied && (
                                                    <>
                                                        <circle cx={x + 155} cy={y + 18} r="10" fill={color} />
                                                        <text x={x + 155} y={y + 22} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">●</text>
                                                    </>
                                                )}

                                                {/* Maintenance icon */}
                                                {courtData.status === 'maintenance' && (
                                                    <text x={x + 86} y={y + 148} textAnchor="middle" fontSize="18">🔧</text>
                                                )}

                                                {/* Hover hint */}
                                                <rect x={x} y={y} width="172" height="170"
                                                    fill="transparent" stroke="transparent" rx="10" />
                                            </g>
                                        );
                                    })
                                )}
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
                            {[
                                { status: 'available', label: 'Sẵn sàng', color: '#28a745' },
                                { status: 'in_use', label: 'Đang sử dụng', color: '#ffc107' },
                                { status: 'maintenance', label: 'Bảo trì', color: '#dc3545' },
                                { status: 'closed', label: 'Đóng cửa', color: '#6c757d' },
                            ].map(item => (
                                <div className="d-flex align-items-center mb-2" key={item.status}>
                                    <div style={{ width: '20px', height: '20px', backgroundColor: item.color, marginRight: '10px', borderRadius: '4px' }} />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0 fw-bold">Thống kê nhanh</h6>
                        </Card.Header>
                        <Card.Body>
                            {[
                                { label: 'Tổng sân', value: `${courtStatuses.length} sân`, color: '' },
                                { label: 'Sẵn sàng', value: `${stats.available} sân`, color: 'success' },
                                { label: 'Đang sử dụng', value: `${stats.in_use} sân`, color: 'warning' },
                                { label: 'Bảo trì', value: `${stats.maintenance} sân`, color: 'danger' },
                                { label: 'Đóng cửa', value: `${stats.closed} sân`, color: 'secondary' },
                            ].map((item, i) => (
                                <div className="mb-3" key={i}>
                                    <small className="text-muted d-block">{item.label}</small>
                                    <h5 className={`fw-bold mb-0 ${item.color ? `text-${item.color}` : ''}`}>{item.value}</h5>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Court Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        🏸 Chi tiết {selectedCourt?.name || `Sân ${selectedCourt?.courtId}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourt && (
                        <div>
                            <div className="mb-3 d-flex align-items-center gap-3">
                                <Badge
                                    style={{ backgroundColor: getStatusColor(selectedCourt.status), fontSize: '14px', padding: '8px 16px' }}
                                >
                                    {getStatusLabel(selectedCourt.status)}
                                </Badge>
                            </div>

                            {selectedCourt.status === 'in_use' && selectedCourt.currentBooking ? (
                                <Card className="border-warning mb-3">
                                    <Card.Header className="bg-warning bg-opacity-10">
                                        <strong>📋 Thông tin booking hiện tại</strong>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <small className="text-muted">Khách hàng</small>
                                                <div className="fw-bold">{selectedCourt.currentBooking.customerName}</div>
                                            </Col>
                                            <Col>
                                                <small className="text-muted">Giờ sử dụng</small>
                                                <div className="fw-bold">
                                                    {selectedCourt.currentBooking.startTime} - {selectedCourt.currentBooking.endTime}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="mt-2">
                                            <small className="text-muted">Số điện thoại</small>
                                            <div>{selectedCourt.currentBooking.phone}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Alert variant={selectedCourt.status === 'available' ? 'success' : selectedCourt.status === 'maintenance' ? 'danger' : 'secondary'}>
                                    {selectedCourt.status === 'available' && '✅ Sân đang trống, sẵn sàng đón khách'}
                                    {selectedCourt.status === 'maintenance' && '🔧 Sân đang trong quá trình bảo trì'}
                                    {selectedCourt.status === 'closed' && '🚫 Sân tạm đóng cửa'}
                                </Alert>
                            )}

                            <Form.Group>
                                <Form.Label className="fw-bold">Cập nhật trạng thái:</Form.Label>
                                <Form.Select
                                    value={selectedCourt.status}
                                    onChange={e => handleStatusChange(selectedCourt.courtId, e.target.value)}
                                >
                                    <option value="available">✅ Sẵn sàng</option>
                                    <option value="in_use">⚡ Đang sử dụng</option>
                                    <option value="maintenance">🔧 Bảo trì</option>
                                    <option value="closed">🚫 Đóng cửa</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={() => setShowDetailModal(false)}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FloorPlan;
