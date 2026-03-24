import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Form, Row, Col, Alert, Tabs, Tab, Image, Spinner } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiUpload, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { BiBuilding, BiMapPin, BiStar } from 'react-icons/bi';

const COURT_TYPES = [
    { value: 'STANDARD', label: 'Tiêu chuẩn', priceDefault: 80000, color: 'info', icon: '🏸' },
    { value: 'VIP', label: 'VIP', priceDefault: 150000, color: 'warning', icon: '⭐' },
    { value: 'DOUBLE', label: 'Sân đôi', priceDefault: 120000, color: 'success', icon: '🎯' },
];

const Courts = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await courtService.getCourts();
                const data = Array.isArray(res.data) ? res.data : res.data?.courts || [];
                setCourts(data.map(c => ({
                    ...c,
                    location: c.location || `Tầng 1`,
                    extras: Array.isArray(c.features) ? c.features : (c.extras || []),
                    images: c.images || [],
                    courtType: c.type || 'STANDARD',
                })));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [duplicateError, setDuplicateError] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        courtNumber: '',
        courtName: '',
        courtType: 'STANDARD',
        pricePerHour: '80000',
        location: '',
        extras: [],
        description: ''
    });
    const [extraInput, setExtraInput] = useState('');
    const [mockImages, setMockImages] = useState({});

    const resetForm = () => {
        setFormData({ courtNumber: '', courtName: '', courtType: 'STANDARD', pricePerHour: '80000', location: '', extras: [], description: '' });
        setExtraInput('');
        setDuplicateError('');
        setActiveTab('info');
    };

    const checkDuplicate = (name, excludeId = null) => {
        return courts.some(c =>
            c.id !== excludeId &&
            c.courtName.toLowerCase().trim() === name.toLowerCase().trim()
        );
    };

    const handleCreate = () => {
        setDuplicateError('');
        if (!formData.courtName.trim()) { setDuplicateError('Vui lòng nhập tên sân.'); return; }
        if (checkDuplicate(formData.courtName)) {
            setDuplicateError(`⚠️ Tên sân "${formData.courtName}" đã tồn tại trong hệ thống!`);
            return;
        }
        const typeInfo = COURT_TYPES.find(t => t.value === formData.courtType);
        const newCourt = {
            id: courts.length + 1,
            courtNumber: Number(formData.courtNumber) || courts.length + 1,
            courtName: formData.courtName.trim(),
            type: formData.courtType,
            courtType: formData.courtType,
            pricePerHour: Number(formData.pricePerHour),
            status: 'available',
            location: formData.location || `Tầng 1`,
            extras: formData.extras,
            description: formData.description,
            features: formData.extras,
            lastMaintenance: new Date().toISOString().split('T')[0],
            nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            images: []
        };
        setCourts([...courts, newCourt]);
        setShowCreateModal(false);
        resetForm();
    };

    const handleEdit = (court) => {
        setSelectedCourt(court);
        setFormData({
            courtNumber: court.courtNumber.toString(),
            courtName: court.courtName,
            courtType: court.courtType || court.type || 'STANDARD',
            pricePerHour: court.pricePerHour.toString(),
            location: court.location || '',
            extras: court.extras || [],
            description: court.description || ''
        });
        setDuplicateError('');
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setDuplicateError('');
        if (checkDuplicate(formData.courtName, selectedCourt.id)) {
            setDuplicateError(`⚠️ Tên sân "${formData.courtName}" đã tồn tại!`);
            return;
        }
        setCourts(courts.map(c =>
            c.id === selectedCourt.id
                ? { ...c, courtName: formData.courtName, type: formData.courtType, courtType: formData.courtType, pricePerHour: Number(formData.pricePerHour), location: formData.location, extras: formData.extras, description: formData.description }
                : c
        ));
        setShowEditModal(false);
        resetForm();
    };

    const handleDelete = (courtId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
            setCourts(courts.filter(c => c.id !== courtId));
        }
    };

    const handleAddExtra = () => {
        if (extraInput.trim() && !formData.extras.includes(extraInput.trim())) {
            setFormData({ ...formData, extras: [...formData.extras, extraInput.trim()] });
            setExtraInput('');
        }
    };

    const handleRemoveExtra = (extra) => {
        setFormData({ ...formData, extras: formData.extras.filter(e => e !== extra) });
    };

    const handleTypeChange = (type) => {
        const typeInfo = COURT_TYPES.find(t => t.value === type);
        setFormData({ ...formData, courtType: type, pricePerHour: typeInfo.priceDefault.toString() });
    };

    const handleMockImageUpload = (courtId) => {
        const newImages = [
            `https://picsum.photos/seed/court${courtId}a/400/300`,
            `https://picsum.photos/seed/court${courtId}b/400/300`,
        ];
        setMockImages(prev => ({ ...prev, [courtId]: newImages }));
        setCourts(courts.map(c => c.id === courtId ? { ...c, images: newImages } : c));
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const getStatusColor = (status) => ({ available: 'success', in_use: 'primary', maintenance: 'warning', closed: 'danger' }[status] || 'secondary');
    const getStatusText = (status) => ({ available: 'Sẵn sàng', in_use: 'Đang sử dụng', maintenance: 'Bảo trì', closed: 'Đóng cửa' }[status] || status);
    const getTypeInfo = (type) => COURT_TYPES.find(t => t.value === type) || COURT_TYPES[0];

    const filteredCourts = courts
        .filter(c => filterType === 'ALL' || c.courtType === filterType || c.type === filterType)
        .filter(c => !searchTerm || c.courtName.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderForm = () => (
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            <Tab eventKey="info" title="📋 Thông tin">
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên sân <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="courtName"
                                placeholder="VD: Sân A1, Sân VIP 01..."
                                value={formData.courtName}
                                onChange={handleChange}
                                isInvalid={!!duplicateError}
                            />
                            {duplicateError && <Form.Control.Feedback type="invalid">{duplicateError}</Form.Control.Feedback>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vị trí</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="VD: Tầng 1, Khu A"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Loại sân <span className="text-danger">*</span></Form.Label>
                    <Row>
                        {COURT_TYPES.map(t => (
                            <Col md={4} key={t.value}>
                                <div
                                    className={`border rounded p-3 text-center cursor-pointer ${formData.courtType === t.value ? `border-${t.color} bg-light` : ''}`}
                                    style={{ cursor: 'pointer', borderWidth: formData.courtType === t.value ? '2px' : '1px' }}
                                    onClick={() => handleTypeChange(t.value)}
                                >
                                    <div style={{ fontSize: '24px' }}>{t.icon}</div>
                                    <Badge bg={t.color} className="mt-1">{t.label}</Badge>
                                    <div className="small text-muted mt-1">{formatPrice(t.priceDefault)}/giờ</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá/giờ (VNĐ) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="pricePerHour"
                                min="0"
                                step="10000"
                                value={formData.pricePerHour}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tiện ích bổ sung</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="VD: Điều hòa, WiFi..."
                                    value={extraInput}
                                    onChange={e => setExtraInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddExtra())}
                                />
                                <Button variant="outline-primary" onClick={handleAddExtra}>+</Button>
                            </div>
                            <div className="mt-2 d-flex flex-wrap gap-1">
                                {formData.extras.map(ex => (
                                    <Badge key={ex} bg="secondary" className="d-flex align-items-center gap-1" style={{ cursor: 'pointer' }}>
                                        {ex} <span onClick={() => handleRemoveExtra(ex)}>✕</span>
                                    </Badge>
                                ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control as="textarea" rows={2} name="description" placeholder="Mô tả thêm về sân..." value={formData.description} onChange={handleChange} />
                </Form.Group>
            </Tab>

            <Tab eventKey="images" title="🖼️ Ảnh sân">
                <div className="text-center py-4">
                    <FiImage size={48} className="text-muted mb-3" />
                    <p className="text-muted">Tải ảnh sân lên để hiển thị cho khách hàng</p>
                    <Button variant="outline-primary">
                        <FiUpload className="me-2" />
                        Chọn ảnh (tối đa 5 ảnh)
                    </Button>
                    <div className="mt-3">
                        <small className="text-muted">Định dạng hỗ trợ: JPG, PNG, WEBP. Kích thước tối đa: 5MB/ảnh</small>
                    </div>
                    {selectedCourt?.images?.length > 0 && (
                        <Row className="mt-3">
                            {selectedCourt.images.map((img, i) => (
                                <Col md={4} key={i} className="mb-2">
                                    <Image src={img} fluid rounded />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </Tab>
        </Tabs>
    );

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-1"><BiBuilding className="me-2 text-primary" />{FACILITY_INFO.name}</h2>
                <p className="text-muted mb-0"><small>{FACILITY_INFO.address} • {FACILITY_INFO.phone}</small></p>
            </div>

            {/* Stats */}
            <Row className="mb-4">
                {COURT_TYPES.map(t => (
                    <Col md={3} key={t.value}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div style={{ fontSize: '32px' }}>{t.icon}</div>
                                <div>
                                    <div className="small text-muted">Sân {t.label}</div>
                                    <h4 className="mb-0 fw-bold">{courts.filter(c => (c.courtType || c.type) === t.value).length}</h4>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div style={{ fontSize: '32px' }}>🏟️</div>
                            <div>
                                <div className="small text-muted">Tổng số sân</div>
                                <h4 className="mb-0 fw-bold">{courts.length}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex gap-2 flex-wrap">
                    <div className="input-group" style={{ width: '250px' }}>
                        <span className="input-group-text"><FiSearch /></span>
                        <Form.Control
                            placeholder="Tìm kiếm sân..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Form.Select style={{ width: '160px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="ALL">Tất cả loại</option>
                        {COURT_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                    </Form.Select>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowCreateModal(true); }}>
                    <FiPlus className="me-2" />Thêm sân mới
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Tên sân</th>
                                <th>Loại</th>
                                <th>Vị trí</th>
                                <th>Giá/giờ</th>
                                <th>Tiện ích</th>
                                <th>Trạng thái</th>
                                <th>Ảnh</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourts.sort((a, b) => a.courtNumber - b.courtNumber).map(court => {
                                const typeInfo = getTypeInfo(court.courtType || court.type);
                                return (
                                    <tr key={court.id}>
                                        <td className="fw-bold align-middle">
                                            <span style={{ fontSize: '18px' }}>{typeInfo.icon}</span> {court.courtName}
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={typeInfo.color}>{typeInfo.label}</Badge>
                                        </td>
                                        <td className="align-middle">
                                            <small className="text-muted"><BiMapPin /> {court.location || '-'}</small>
                                        </td>
                                        <td className="align-middle fw-bold text-primary">{formatPrice(court.pricePerHour)}</td>
                                        <td className="align-middle">
                                            <div className="d-flex flex-wrap gap-1">
                                                {(court.extras || []).slice(0, 2).map(ex => (
                                                    <Badge key={ex} bg="light" text="dark" className="border">{ex}</Badge>
                                                ))}
                                                {(court.extras || []).length > 2 && <Badge bg="light" text="dark" className="border">+{(court.extras || []).length - 2}</Badge>}
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <Badge bg={getStatusColor(court.status)}>{getStatusText(court.status)}</Badge>
                                        </td>
                                        <td className="align-middle">
                                            <Button
                                                size="sm"
                                                variant={court.images?.length > 0 ? 'outline-success' : 'outline-secondary'}
                                                onClick={() => { setSelectedCourt(court); setShowImageModal(true); }}
                                            >
                                                <FiImage />
                                                {court.images?.length > 0 ? ` ${court.images.length}` : ' Thêm'}
                                            </Button>
                                        </td>
                                        <td className="align-middle">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button variant="outline-primary" size="sm" onClick={() => handleEdit(court)}><FiEdit /></Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(court.id)}><FiTrash2 /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    {filteredCourts.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            <FiAlertCircle size={32} className="mb-2" />
                            <div>Không tìm thấy sân phù hợp</div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={() => { setShowCreateModal(false); resetForm(); }} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title><FiPlus className="me-2" />Thêm Sân Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {duplicateError && <Alert variant="danger"><FiAlertCircle className="me-2" />{duplicateError}</Alert>}
                    {renderForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>Hủy</Button>
                    <Button variant="primary" onClick={handleCreate}><FiPlus className="me-2" />Tạo sân</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetForm(); }} size="lg" centered>
                <Modal.Header closeButton className="bg-warning">
                    <Modal.Title><FiEdit className="me-2" />Chỉnh Sửa Sân</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {duplicateError && <Alert variant="danger"><FiAlertCircle className="me-2" />{duplicateError}</Alert>}
                    {renderForm()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>Hủy</Button>
                    <Button variant="warning" onClick={handleSaveEdit}><FiEdit className="me-2" />Lưu thay đổi</Button>
                </Modal.Footer>
            </Modal>

            {/* Image Upload Modal */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title><FiImage className="me-2" />Ảnh sân - {selectedCourt?.courtName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-4">
                        <Button variant="primary" onClick={() => handleMockImageUpload(selectedCourt?.id)}>
                            <FiUpload className="me-2" />Tải ảnh lên (Demo)
                        </Button>
                    </div>
                    {selectedCourt && (mockImages[selectedCourt.id] || selectedCourt.images || []).length > 0 ? (
                        <Row>
                            {(mockImages[selectedCourt.id] || selectedCourt.images || []).map((img, i) => (
                                <Col md={6} key={i} className="mb-3">
                                    <Image src={img} fluid rounded className="shadow-sm" />
                                    <div className="text-center mt-2">
                                        <Button size="sm" variant="outline-danger">Xóa ảnh</Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            <FiImage size={48} className="mb-2" />
                            <p>Chưa có ảnh nào. Nhấn "Tải ảnh lên" để thử demo.</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Courts;
