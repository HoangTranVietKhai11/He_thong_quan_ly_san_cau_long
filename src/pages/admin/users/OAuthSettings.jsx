import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { BiLogoGoogle, BiLogoFacebook, BiCheck, BiX, BiSave } from 'react-icons/bi';

const OAuthSettings = () => {
    const [google, setGoogle] = useState({ enabled: true, clientId: 'google-client-id-123.apps.googleusercontent.com', clientSecret: '••••••••••••••••' });
    const [facebook, setFacebook] = useState({ enabled: false, clientId: '', clientSecret: '' });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Cài đặt đăng nhập MXH (OAuth)</h2>
                    <p className="text-muted mb-0">Cấu hình đăng nhập bằng Google và Facebook</p>
                </div>
                <Button variant="primary" onClick={handleSave}>
                    <BiSave className="me-2" />Lưu cấu hình
                </Button>
            </div>

            {saved && <Alert variant="success" className="mb-3">✅ Đã lưu cấu hình OAuth thành công!</Alert>}

            <Row className="g-4">
                {/* Google OAuth */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <BiLogoGoogle size={24} className="text-danger" />
                                <span className="fw-bold">Google Login</span>
                            </div>
                            <Form.Check
                                type="switch"
                                id="google-switch"
                                checked={google.enabled}
                                onChange={e => setGoogle({ ...google, enabled: e.target.checked })}
                                label={<Badge bg={google.enabled ? 'success' : 'secondary'}>{google.enabled ? 'Đang bật' : 'Đang tắt'}</Badge>}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Client ID <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    value={google.clientId}
                                    onChange={e => setGoogle({ ...google, clientId: e.target.value })}
                                    disabled={!google.enabled}
                                    placeholder="xxxxx.apps.googleusercontent.com"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Client Secret <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    value={google.clientSecret}
                                    onChange={e => setGoogle({ ...google, clientSecret: e.target.value })}
                                    disabled={!google.enabled}
                                    placeholder="Client Secret từ Google Console"
                                />
                            </Form.Group>
                            <div className="bg-light rounded p-3 small text-muted">
                                <strong>Callback URL:</strong><br />
                                <code>http://localhost:5173/auth/google/callback</code>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                            {google.enabled && google.clientId
                                ? <span className="text-success"><BiCheck /> Đã cấu hình</span>
                                : <span className="text-muted"><BiX /> Chưa cấu hình</span>
                            }
                        </Card.Footer>
                    </Card>
                </Col>

                {/* Facebook OAuth */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <BiLogoFacebook size={24} className="text-primary" />
                                <span className="fw-bold">Facebook Login</span>
                            </div>
                            <Form.Check
                                type="switch"
                                id="facebook-switch"
                                checked={facebook.enabled}
                                onChange={e => setFacebook({ ...facebook, enabled: e.target.checked })}
                                label={<Badge bg={facebook.enabled ? 'success' : 'secondary'}>{facebook.enabled ? 'Đang bật' : 'Đang tắt'}</Badge>}
                            />
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>App ID <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    value={facebook.clientId}
                                    onChange={e => setFacebook({ ...facebook, clientId: e.target.value })}
                                    disabled={!facebook.enabled}
                                    placeholder="Facebook App ID"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>App Secret <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="password"
                                    value={facebook.clientSecret}
                                    onChange={e => setFacebook({ ...facebook, clientSecret: e.target.value })}
                                    disabled={!facebook.enabled}
                                    placeholder="Facebook App Secret"
                                />
                            </Form.Group>
                            <div className="bg-light rounded p-3 small text-muted">
                                <strong>Callback URL:</strong><br />
                                <code>http://localhost:5173/auth/facebook/callback</code>
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                            {facebook.enabled && facebook.clientId
                                ? <span className="text-success"><BiCheck /> Đã cấu hình</span>
                                : <span className="text-muted"><BiX /> Chưa cấu hình</span>
                            }
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm mt-4">
                <Card.Header className="bg-white fw-bold">Hướng dẫn cấu hình</Card.Header>
                <Card.Body>
                    <Row className="g-3 small">
                        <Col md={6}>
                            <strong>Google:</strong>
                            <ol className="mt-2 mb-0">
                                <li>Truy cập <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer">Google Cloud Console</a></li>
                                <li>Tạo OAuth 2.0 Client ID</li>
                                <li>Thêm Callback URL vào danh sách Redirect URIs</li>
                                <li>Sao chép Client ID và Secret vào form</li>
                            </ol>
                        </Col>
                        <Col md={6}>
                            <strong>Facebook:</strong>
                            <ol className="mt-2 mb-0">
                                <li>Truy cập <a href="https://developers.facebook.com" target="_blank" rel="noreferrer">Facebook Developers</a></li>
                                <li>Tạo ứng dụng và bật Facebook Login</li>
                                <li>Thêm Callback URL vào Valid OAuth Redirect URIs</li>
                                <li>Sao chép App ID và Secret vào form</li>
                            </ol>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OAuthSettings;
