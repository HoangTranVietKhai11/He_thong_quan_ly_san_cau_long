import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { BiEnvelope, BiLock } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result.success) {
            const role = result.user.role;
            navigate(
                role === 'admin' ? '/admin/dashboard' :
                    role === 'owner' ? '/owner/dashboard' :
                        role === 'staff' ? '/staff/dashboard' :
                            '/user/dashboard'
            );
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <Row className="justify-content-center">
            <Col md={6} lg={5}>
                <Card className="shadow-sm">
                    <Card.Body className="p-5">
                        <h2 className="text-center mb-4">Đăng nhập</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <BiEnvelope className="me-2" />
                                    Email
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <BiLock className="me-2" />
                                    Mật khẩu
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between mb-3">
                                <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" />
                                <Link to="/forgot-password">Quên mật khẩu?</Link>
                            </div>

                            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </Form>

                        <hr />

                        <p className="text-center mb-0">
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
