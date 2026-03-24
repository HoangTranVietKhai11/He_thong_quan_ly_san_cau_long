const CourtPricing = () => {
    const [editMode, setEditMode] = useState(false);
    const [priceMatrix, setPriceMatrix] = useState({});
    const timeSlots = [];
    const [pricingTiers, setPricingTiers] = useState({
        offPeak: { name: 'Giờ thấp điểm', price: 170000, color: '#28a745', description: '6:00 - 9:00 & 14:00 - 17:00' },
        peak: { name: 'Giờ cao điểm', price: 200000, color: '#fd7e14', description: '17:00 - 21:00' },
        vip: { name: 'Giờ siêu cao điểm', price: 220000, color: '#dc3545', description: '9:00 - 14:00 & 21:00 - 23:00' },
    });

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleSave = () => {
        setEditMode(false);
        alert('✅ Đã lưu cấu hình giá thành công!');
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleTierChange = (slotId, tier) => {
        setPriceMatrix(prev => ({ ...prev, [slotId]: { ...prev[slotId], tier } }));
    };

    const handleGoldenToggle = (slotId) => {
        setPriceMatrix(prev => ({
            ...prev,
            [slotId]: { ...prev[slotId], isGolden: !prev[slotId].isGolden }
        }));
    };

    const handlePriceChange = (tier, newPrice) => {
        setPricingTiers(prev => ({ ...prev, [tier]: { ...prev[tier], price: parseInt(newPrice) || 0 } }));
    };

    const goldenSlotCount = Object.values(priceMatrix).filter(s => s.isGolden).length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">⚡ Giá sân theo giờ</h2>
                    <p className="text-muted">Thiết lập đơn giá (170k - 220k) và đánh dấu khung giờ vàng</p>
                </div>
                <div>
                    {!editMode ? (
                        <Button variant="primary" onClick={() => setEditMode(true)}>
                            <BiEdit className="me-2" />Chỉnh sửa giá
                        </Button>
                    ) : (
                        <>
                            <Button variant="success" className="me-2" onClick={handleSave}><BiSave className="me-2" />Lưu thay đổi</Button>
                            <Button variant="secondary" onClick={handleCancel}><BiX className="me-2" />Hủy</Button>
                        </>
                    )}
                </div>
            </div>

            {/* Pricing Tiers */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between">
                    <h5 className="mb-0 fw-bold">Cấu hình mức giá</h5>
                    <span className="text-muted small">
                        <BiStar className="text-warning me-1" />
                        {goldenSlotCount} khung giờ vàng đang hoạt động
                    </span>
                </Card.Header>
                <Card.Body>
                    <Row>
                        {Object.entries(pricingTiers).map(([key, tier]) => (
                            <Col md={4} key={key}>
                                <Card className="border h-100" style={{ borderColor: tier.color, borderWidth: '2px' }}>
                                    <Card.Body>
                                        <div className="d-flex align-items-center mb-3">
                                            <div style={{ width: '18px', height: '18px', backgroundColor: tier.color, borderRadius: '4px', marginRight: '10px' }} />
                                            <h6 className="mb-0 fw-bold">{tier.name}</h6>
                                        </div>
                                        <div className="small text-muted mb-2">{tier.description}</div>
                                        {editMode ? (
                                            <Form.Group>
                                                <Form.Label className="small">Đơn giá (VNĐ/giờ)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={tier.price}
                                                    onChange={e => handlePriceChange(key, e.target.value)}
                                                    step="5000"
                                                    min="100000"
                                                    max="500000"
                                                />
                                                <Form.Text className="text-muted">Khoảng khuyến nghị: 170k - 220k</Form.Text>
                                            </Form.Group>
                                        ) : (
                                            <div>
                                                <small className="text-muted d-block">Đơn giá</small>
                                                <h4 className="mb-0 fw-bold" style={{ color: tier.color }}>{formatPrice(tier.price)}</h4>
                                                <small className="text-muted">/giờ</small>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>

            {/* Time Slot Matrix */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0 fw-bold">Ma trận giá theo khung giờ</h5>
                    <small className="text-muted">
                        <BiStar className="text-warning" /> = Giờ vàng (áp dụng thêm phụ phí đặc biệt / ưu tiên hiển thị)
                    </small>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>#</th>
                                <th>Khung giờ</th>
                                <th>Giờ vàng</th>
                                <th>Mức giá</th>
                                <th>Đơn giá</th>
                                {editMode && <th>Thay đổi mức giá</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {mockCourtPricing.timeSlots.map(slot => {
                                const slotData = priceMatrix[slot.id];
                                if (!slotData) return null;
                                const tierInfo = pricingTiers[slotData.tier];
                                const isGolden = slotData.isGolden;

                                return (
                                    <tr key={slot.id} style={isGolden ? { backgroundColor: 'rgba(255,193,7,0.08)' } : {}}>
                                        <td className="align-middle text-muted">{slot.id}</td>
                                        <td className="align-middle">
                                            <strong>{slot.label}</strong>
                                            {isGolden && <BiStar className="text-warning ms-2" />}
                                        </td>
                                        <td className="align-middle">
                                            {editMode ? (
                                                <Form.Check
                                                    type="switch"
                                                    checked={isGolden}
                                                    onChange={() => handleGoldenToggle(slot.id)}
                                                    label={isGolden ? 'Bật' : 'Tắt'}
                                                />
                                            ) : (
                                                isGolden
                                                    ? <Badge bg="warning" text="dark"><BiStar /> Giờ vàng</Badge>
                                                    : <span className="text-muted small">—</span>
                                            )}
                                        </td>
                                        <td className="align-middle">
                                            <Badge
                                                bg="light"
                                                text="dark"
                                                style={{ borderLeft: `4px solid ${tierInfo?.color}`, padding: '8px 12px' }}
                                            >
                                                {tierInfo?.name}
                                            </Badge>
                                        </td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(tierInfo?.price)}</strong>
                                            {isGolden && (
                                                <span className="ms-2 text-warning small fw-bold">⭐ +10%</span>
                                            )}
                                        </td>
                                        {editMode && (
                                            <td className="align-middle">
                                                <Form.Select
                                                    size="sm"
                                                    value={slotData.tier}
                                                    onChange={e => handleTierChange(slot.id, e.target.value)}
                                                    style={{ width: '200px' }}
                                                >
                                                    {Object.entries(pricingTiers).map(([k, t]) => (
                                                        <option key={k} value={k}>{t.name} - {formatPrice(t.price)}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Stats */}
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Tổng khung giờ</div>
                            <h3 className="fw-bold mb-0">{mockCourtPricing.timeSlots.length}</h3>
                            <small className="text-muted">khung giờ/ngày</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Khung giờ vàng</div>
                            <h3 className="fw-bold mb-0 text-warning">{goldenSlotCount}</h3>
                            <small className="text-muted">giờ đặc biệt</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm text-center">
                        <Card.Body>
                            <div className="text-muted small mb-1">Giá trung bình</div>
                            <h3 className="fw-bold mb-0 text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                    Object.values(pricingTiers).reduce((s, t) => s + t.price, 0) / 3
                                )}
                            </h3>
                            <small className="text-muted">/giờ (8 sân)</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CourtPricing;
