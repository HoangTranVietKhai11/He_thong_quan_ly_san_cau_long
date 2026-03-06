import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { BiLockAlt, BiShield, BiKey, BiSave } from 'react-icons/bi';

const Security = () => {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        console.log('Changing password...');
        // Reset form
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowChangePassword(false);
    };

    const toggle2FA = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        console.log('2FA toggled:', !twoFactorEnabled);
    };

    const loginHistory = [
        {
            id: 1,
            date: '2026-02-02 08:30:00',
            device: 'Chrome - Windows',
            ip: '192.168.1.100',
            location: 'Hà Nội, Việt Nam',
            status: 'success'
        },
        {
            id: 2,
            date: '2026-02-01 08:15:00',
            device: 'Chrome - Windows',
            ip: '192.168.1.100',
            location: 'Hà Nội, Việt Nam',
            status: 'success'
        },
        {
            id: 3,
            date: '2026-01-31 08:45:00',
            device: 'Chrome - Windows',
            ip: '192.168.1.100',
            location: 'Hà Nội, Việt Nam',
            status: 'success'
        }
    ];

    return (
        <Container fluid className="py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">Bảo mật</h2>
                <p className="text-muted">Quản lý mật khẩu và xác thực</p>
            </div>

            <Row>
                <Col lg={7}>
                    {/* Change Password */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0">
                                <BiKey className="me-2" />
                                Đổi mật khẩu
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            {!showChangePassword ? (
                                <div className="text-center py-3">
                                    <BiLockAlt size={48} className="text-muted mb-3 opacity-25" />
                                    <p className="text-muted">Để đảm bảo an toàn, hãy thay đổi mật khẩu thường xuyên</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowChangePassword(true)}
                                    >
                                        <BiKey className="me-2" />
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                            ) : (
                                <Form onSubmit={handlePasswordChange}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mật khẩu hiện tại</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Mật khẩu mới</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary">
                                            <BiSave className="me-2" />
                                            Lưu thay đổi
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setShowChangePassword(false);
                                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Login History */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0">Lịch sử đăng nhập</h6>
                        </Card.Header>
                        <Card.Body>
                            {loginHistory.map((login) => (
                                <div key={login.id} className="border-bottom pb-3 mb-3 last-child-no-border">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="fw-bold">{login.device}</div>
                                            <div className="small text-muted">
                                                {login.date}<br />
                                                {login.location} - IP: {login.ip}
                                            </div>
                                        </div>
                                        <Badge bg="success">
                                            Thành công
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    {/* Two-Factor Authentication */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0">
                                <BiShield className="me-2" />
                                Xác thực hai yếu tố (2FA)
                            </h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <div className="fw-bold">Trạng thái 2FA</div>
                                    <small className="text-muted">
                                        {twoFactorEnabled ? 'Đang bật' : 'Đang tắt'}
                                    </small>
                                </div>
                                <Form.Check
                                    type="switch"
                                    id="2fa-switch"
                                    checked={twoFactorEnabled}
                                    onChange={toggle2FA}
                                    className="fs-4"
                                />
                            </div>

                            {twoFactorEnabled ? (
                                <div className="alert alert-success">
                                    <BiShield size={20} className="me-2" />
                                    Xác thực hai yếu tố đã được kích hoạt
                                </div>
                            ) : (
                                <div className="alert alert-warning">
                                    <BiShield size={20} className="me-2" />
                                    Bật 2FA để tăng cường bảo mật tài khoản
                                </div>
                            )}

                            <div className="small text-muted">
                                <p className="mb-2"><strong>Lợi ích của 2FA:</strong></p>
                                <ul className="mb-0">
                                    <li>Bảo vệ tài khoản tốt hơn</li>
                                    <li>Ngăn chặn truy cập trái phép</li>
                                    <li>Thông báo đăng nhập bất thường</li>
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Security Tips */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h6 className="mb-0">Mẹo bảo mật</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li className="mb-2">Không chia sẻ mật khẩu với người khác</li>
                                <li className="mb-2">Đổi mật khẩu định kỳ (ít nhất 3 tháng/lần)</li>
                                <li className="mb-2">Sử dụng mật khẩu mạnh và khác nhau cho mỗi dịch vụ</li>
                                <li className="mb-2">Luôn đăng xuất khi rời khỏi máy tính</li>
                                <li>Kiểm tra lịch sử đăng nhập thường xuyên</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Security;
