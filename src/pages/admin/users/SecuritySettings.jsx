import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Table } from 'react-bootstrap';
import { BiShield, BiLock, BiKey, BiSave, BiCheck } from 'react-icons/bi';

const SecuritySettings = () => {
    const [policy, setPolicy] = useState({
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumber: true,
        requireSpecial: false,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        requireOtpLogin: false,
        forcePasswordChange: 90,
    });
    const [twoFaConfig, setTwoFaConfig] = useState({ enabled: true, method: 'email' });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Cài đặt bảo mật</h2>
                    <p className="text-muted mb-0">Quản lý chính sách mật khẩu, 2FA và phiên đăng nhập</p>
                </div>
                <Button variant="primary" onClick={handleSave}>
                    <BiSave className="me-2" />Lưu cài đặt
                </Button>
            </div>

            {saved && <Alert variant="success" className="mb-3"><BiCheck /> Đã lưu cài đặt bảo mật thành công!</Alert>}

            <Row className="g-4">
                <Col md={6}>
                    {/* Password Policy */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white fw-bold"><BiLock className="me-2" />Chính sách mật khẩu</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Độ dài tối thiểu: <strong>{policy.minPasswordLength} ký tự</strong></Form.Label>
                                <Form.Range min={6} max={20} value={policy.minPasswordLength}
                                    onChange={e => setPolicy({ ...policy, minPasswordLength: +e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Check type="switch" id="req-upper"
                                    checked={policy.requireUppercase}
                                    onChange={e => setPolicy({ ...policy, requireUppercase: e.target.checked })}
                                    label="Bắt buộc có chữ hoa (A-Z)" />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Check type="switch" id="req-num"
                                    checked={policy.requireNumber}
                                    onChange={e => setPolicy({ ...policy, requireNumber: e.target.checked })}
                                    label="Bắt buộc có số (0-9)" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="switch" id="req-special"
                                    checked={policy.requireSpecial}
                                    onChange={e => setPolicy({ ...policy, requireSpecial: e.target.checked })}
                                    label="Bắt buộc có ký tự đặc biệt (!@#$...)" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Yêu cầu đổi mật khẩu sau <strong>{policy.forcePasswordChange} ngày</strong></Form.Label>
                                <Form.Range min={0} max={365} step={30} value={policy.forcePasswordChange}
                                    onChange={e => setPolicy({ ...policy, forcePasswordChange: +e.target.value })} />
                                <Form.Text className="text-muted">{policy.forcePasswordChange === 0 ? 'Không bắt buộc' : `Mỗi ${policy.forcePasswordChange} ngày`}</Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Session Settings */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold"><BiKey className="me-2" />Cài đặt phiên đăng nhập</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Hết hạn phiên sau <strong>{policy.sessionTimeout} phút</strong> không hoạt động</Form.Label>
                                <Form.Range min={15} max={480} step={15} value={policy.sessionTimeout}
                                    onChange={e => setPolicy({ ...policy, sessionTimeout: +e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số lần đăng nhập sai tối đa: <strong>{policy.maxLoginAttempts} lần</strong></Form.Label>
                                <Form.Range min={3} max={10} value={policy.maxLoginAttempts}
                                    onChange={e => setPolicy({ ...policy, maxLoginAttempts: +e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Thời gian khóa tài khoản: <strong>{policy.lockoutDuration} phút</strong></Form.Label>
                                <Form.Range min={5} max={60} step={5} value={policy.lockoutDuration}
                                    onChange={e => setPolicy({ ...policy, lockoutDuration: +e.target.value })} />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    {/* 2FA Config */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white fw-bold"><BiShield className="me-2" />Xác thực hai yếu tố (2FA)</Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="fw-bold">Bật 2FA cho toàn hệ thống</div>
                                    <small className="text-muted">Yêu cầu xác minh thêm khi đăng nhập</small>
                                </div>
                                <Form.Check type="switch" id="2fa-global"
                                    checked={twoFaConfig.enabled}
                                    onChange={e => setTwoFaConfig({ ...twoFaConfig, enabled: e.target.checked })}
                                    className="fs-5" />
                            </div>
                            {twoFaConfig.enabled && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phương thức 2FA</Form.Label>
                                        <Form.Select value={twoFaConfig.method}
                                            onChange={e => setTwoFaConfig({ ...twoFaConfig, method: e.target.value })}>
                                            <option value="email">OTP qua Email</option>
                                            <option value="sms">OTP qua SMS</option>
                                            <option value="totp">Ứng dụng Authenticator (TOTP)</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Alert variant="info" className="small">
                                        Phương thức đang chọn: <strong>{
                                            twoFaConfig.method === 'email' ? 'OTP Email' :
                                                twoFaConfig.method === 'sms' ? 'OTP SMS' : 'Google Authenticator'
                                        }</strong>
                                    </Alert>
                                </>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Summary Table */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white fw-bold">Tóm tắt cấu hình hiện tại</Card.Header>
                        <Card.Body className="p-0">
                            <Table className="mb-0 small">
                                <tbody>
                                    {[
                                        ['Độ dài mật khẩu tối thiểu', `${policy.minPasswordLength} ký tự`],
                                        ['Yêu cầu chữ hoa', policy.requireUppercase ? 'Có' : 'Không'],
                                        ['Yêu cầu số', policy.requireNumber ? 'Có' : 'Không'],
                                        ['Ký tự đặc biệt', policy.requireSpecial ? 'Bắt buộc' : 'Không bắt buộc'],
                                        ['Hết hạn phiên', `${policy.sessionTimeout} phút`],
                                        ['Số lần sai tối đa', `${policy.maxLoginAttempts} lần`],
                                        ['Thời gian khóa', `${policy.lockoutDuration} phút`],
                                        ['2FA', twoFaConfig.enabled ? <Badge bg="success">Bật</Badge> : <Badge bg="secondary">Tắt</Badge>],
                                    ].map(([k, v], i) => (
                                        <tr key={i}>
                                            <td className="ps-3 text-muted">{k}</td>
                                            <td className="text-end pe-3 fw-bold">{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SecuritySettings;
