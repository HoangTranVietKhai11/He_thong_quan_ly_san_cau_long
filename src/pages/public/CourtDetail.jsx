import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Spinner } from 'react-bootstrap';
import { BiStar, BiMapPin, BiTime, BiMoney, BiPhone, BiUser } from 'react-icons/bi';
import courtService from '../../services/courtService';

const CourtDetail = () => {
    const { id } = useParams();
    const [court, setCourt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [courtReviews, setCourtReviews] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await courtService.getCourtById(id);
                setCourt(res.data.data || res.data);
                // reviews would come from another service usually, keeping it empty for now
                setCourtReviews([]);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!court) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <h2>Không tìm thấy sân</h2>
                    <Button as={Link} to="/" variant="primary" className="mt-3">
                        Về trang chủ
                    </Button>
                </div>
            </Container>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <Container className="py-5">
            {/* Back Button */}
            <Button as={Link} to="/" variant="outline-secondary" className="mb-4">
                ← Quay lại
            </Button>

            <Row>
                <Col lg={8}>
                    {/* Court Image */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <img
                            src={court.image_url || court.image || 'https://via.placeholder.com/800x600?text=Sân+Cầu+Lông'}
                            alt={court.name}
                            className="w-100"
                            style={{ height: '400px', objectFit: 'cover' }}
                        />
                    </Card>

                    {/* Court Info */}
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h2 className="fw-bold mb-2">{court.name}</h2>
                                    <div className="d-flex align-items-center gap-3 text-muted">
                                        <span>
                                            <BiStar className="text-warning" /> {court.rating || 5.0}
                                        </span>
                                        <span>({court.totalReviews || 0} đánh giá)</span>
                                        <span>
                                            <BiUser /> {court.totalCourts || 1} sân
                                        </span>
                                    </div>
                                </div>
                                <Badge bg="success" className="fs-5">
                                    {formatPrice(court.price_per_hour || court.pricePerHour || 0)}/giờ
                                </Badge>
                            </div>

                            <div className="mb-3">
                                <h5 className="mb-2">
                                    <BiMapPin className="text-primary" /> Địa chỉ
                                </h5>
                                <p className="text-muted mb-0">{court.address || 'Hệ thống Sân Lông Badminton Pro'}</p>
                            </div>

                            <div className="mb-3">
                                <h5 className="mb-2">
                                    <BiTime className="text-primary" /> Giờ mở cửa
                                </h5>
                                <p className="text-muted mb-0">{court.openTime} - {court.closeTime}</p>
                            </div>

                            <div className="mb-3">
                                <h5 className="mb-2">Mô tả</h5>
                                <p className="text-muted">{court.description || 'Sân cầu lông chất lượng cao, trang thiết bị hiện đại, đem đến trải nghiệm tốt nhất cho người chơi.'}</p>
                            </div>

                            <div>
                                <h5 className="mb-3">Tiện ích</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {(court.amenities || ['Wifi', 'Bãi đỗ xe', 'Căn tin']).map((amenity, index) => (
                                        <Badge key={index} bg="secondary" className="px-3 py-2">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Reviews */}
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Đánh giá ({courtReviews.length})</h4>
                            {courtReviews.length > 0 ? (
                                <ListGroup variant="flush">
                                    {courtReviews.map(review => (
                                        <ListGroup.Item key={review.id} className="px-0">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <strong>{review.userName}</strong>
                                                    <div className="text-warning">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <small className="text-muted">{review.createdAt}</small>
                                            </div>
                                            <p className="text-muted mb-0">{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted text-center py-4">
                                    Chưa có đánh giá nào
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Booking Card */}
                    <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Body>
                            <h4 className="fw-bold mb-4">Đặt sân ngay</h4>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Giá thuê:</span>
                                    <strong className="text-primary">{formatPrice(court.price_per_hour || court.pricePerHour || 0)}/giờ</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Số sân:</span>
                                    <strong>{court.totalCourts || 1} sân</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Thời gian:</span>
                                    <strong>{court.openTime || '06:00'} - {court.closeTime || '22:00'}</strong>
                                </div>
                            </div>

                            <hr />

                            <Button
                                as={Link}
                                to="/register"
                                variant="primary"
                                className="w-100 mb-2"
                                size="lg"
                            >
                                Đặt sân ngay
                            </Button>
                            <Button
                                as={Link}
                                to="/login"
                                variant="outline-primary"
                                className="w-100"
                            >
                                Đăng nhập để đặt
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Owner Info */}
                    <Card className="border-0 shadow-sm mt-3">
                        <Card.Body>
                            <h5 className="fw-bold mb-3">Thông tin chủ sân</h5>
                            <div className="mb-2">
                                <BiUser className="text-primary me-2" />
                                <strong>{court.owner}</strong>
                            </div>
                            <div>
                                <BiPhone className="text-primary me-2" />
                                <span className="text-muted">Liên hệ qua hệ thống</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CourtDetail;
