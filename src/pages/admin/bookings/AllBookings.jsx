const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const BOOKING_STATUS = {
        pending: { label: 'Chờ xác nhận', color: 'warning' },
        confirmed: { label: 'Đã xác nhận', color: 'primary' },
        checked_in: { label: 'Đã check-in', color: 'info' },
        completed: { label: 'Hoàn thành', color: 'success' },
        cancelled: { label: 'Đã hủy', color: 'secondary' }
    };

    const PAYMENT_STATUS = {
        pending: { label: 'Chờ thanh toán', color: 'warning' },
        paid: { label: 'Đã thanh toán', color: 'success' },
        refunded: { label: 'Đã hoàn tiền', color: 'info' }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const info = BOOKING_STATUS[status];
        return <Badge bg={info.color}>{info.label}</Badge>;
    };

    const getPaymentBadge = (status) => {
        const info = PAYMENT_STATUS[status];
        return <Badge bg={info.color}>{info.label}</Badge>;
    };

    // Filtering logic
    let filteredBookings = bookings;
    if (filterStatus !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === filterStatus);
    }
    if (filterPayment !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.paymentStatus === filterPayment);
    }
    if (searchTerm) {
        filteredBookings = filteredBookings.filter(b =>
            b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.userPhone.includes(searchTerm)
        );
    }

    const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.price, 0);
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const todayBookings = bookings.filter(b => b.date === '2026-02-05').length;

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Tất cả đặt sân</h2>
                    <p className="text-muted">Quản lý và theo dõi tất cả booking</p>
                </div>
                <Button variant="primary">
                    <BiCalendar className="me-2" />
                    Tạo booking mới
                </Button>
            </div>

            {/* Statistics */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small">Tổng bookings</div>
                                    <h3 className="fw-bold mb-0">{bookings.length}</h3>
                                </div>
                                <BiCalendar size={40} className="text-primary" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small">Chờ xác nhận</div>
                                    <h3 className="fw-bold mb-0 text-warning">{pendingCount}</h3>
                                </div>
                                <BiFilter size={40} className="text-warning" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small">Hôm nay</div>
                                    <h3 className="fw-bold mb-0 text-info">{todayBookings}</h3>
                                </div>
                                <BiCalendar size={40} className="text-info" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-muted small">Doanh thu</div>
                                    <h4 className="fw-bold mb-0 text-success">{formatPrice(totalRevenue)}</h4>
                                </div>
                                <BiMoney size={40} className="text-success" />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text><BiSearch /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Tìm theo tên, SĐT, mã booking"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="checked_in">Đã check-in</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                                <option value="all">Tất cả thanh toán</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="pending">Chờ thanh toán</option>
                                <option value="refunded">Đã hoàn tiền</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Bookings Table */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Mã booking</th>
                                    <th>Khách hàng</th>
                                    <th>SĐT</th>
                                    <th>Sân</th>
                                    <th>Ngày</th>
                                    <th>Giờ</th>
                                    <th>Giá</th>
                                    <th>Trạng thái</th>
                                    <th>Thanh toán</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="align-middle">
                                            <strong>{booking.id}</strong>
                                        </td>
                                        <td className="align-middle">{booking.userName}</td>
                                        <td className="align-middle">{booking.userPhone}</td>
                                        <td className="align-middle">{booking.courtName}</td>
                                        <td className="align-middle">{formatDate(booking.date)}</td>
                                        <td className="align-middle">{booking.timeSlot}</td>
                                        <td className="align-middle">
                                            <strong className="text-primary">{formatPrice(booking.price)}</strong>
                                        </td>
                                        <td className="align-middle">{getStatusBadge(booking.status)}</td>
                                        <td className="align-middle">{getPaymentBadge(booking.paymentStatus)}</td>
                                        <td className="align-middle">
                                            <Button size="sm" variant="outline-primary">Chi tiết</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {filteredBookings.length === 0 && (
                <div className="text-center text-muted py-5">
                    <p>Không tìm thấy booking nào</p>
                </div>
            )}
        </Container>
    );
};

export default AllBookings;
