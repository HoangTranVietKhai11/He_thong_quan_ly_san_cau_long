import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            if (!/^[0-9]*$/.test(value)) return; // chỉ cho nhập số
            if (value.length > 0 && value[0] !== '0') return; // số đầu tiên phải là 0
            if (value.length > 10) return; // tối đa 10 chữ số
        }
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phone || formData.phone.length < 10) {
            setError('Vui lòng nhập số điện thoại đầy đủ (10 chữ số)!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        const result = await register(formData);

        if (result.success) {
            navigate('/user/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <Row className="justify-content-center">
            <Col md={8} lg={6}>
                <Card className="shadow-sm">
                    <Card.Body className="p-5">
                        <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="VD: nguyenvana"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        name="phone"
                                        placeholder="VD: 0912345678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        required
                                    />
                                    <Form.Text className="text-muted">10 chữ số, bắt đầu từ 0</Form.Text>
                                </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Xác nhận mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>


                            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
                                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </Button>
                        </Form>

                        <hr />

                        <p className="text-center mb-0">
                            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row >
    );
};

export default Register;
