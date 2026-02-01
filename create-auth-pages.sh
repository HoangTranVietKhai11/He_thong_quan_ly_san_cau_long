#!/bin/bash

# This script creates all the remaining page components for the React app

# Authentication Pages
cat > src/pages/auth/Login.jsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { BiEnvelope, BiLock, BiEye, BiEyeSlash } from 'react-icons/bi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
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
      showSuccess('Đăng nhập thành công!');
      const role = result.user.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/user/dashboard');
    } else {
      setError(result.error);
      showError(result.error);
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
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiEyeSlash /> : <BiEye />}
                  </Button>
                </div>
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
        
        <Card className="mt-3 shadow-sm">
          <Card.Body className="p-3">
            <small className="text-muted">
              <strong>Demo:</strong> Email: any@email.com | Password: anything
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
EOF

# Register Page
cat > src/pages/auth/Register.jsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validatePassword, getPasswordStrength } from '../../utils/helpers';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });
  
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      const validation = validatePassword(value);
      const strength = getPasswordStrength(validation.strength);
      setPasswordStrength(strength);
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      showSuccess('Đăng ký thành công!');
      navigate('/user/dashboard');
    } else {
      setError(result.error);
      showError(result.error);
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
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
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
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
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
                {formData.password && (
                  <>
                    <ProgressBar
                      now={passwordStrength.strength}
                      variant={passwordStrength.color}
                      className="mt-2"
                      style={{ height: '5px' }}
                    />
                    <small className={`text-${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </small>
                  </>
                )}
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

              <Form.Group className="mb-3">
                <Form.Label>Loại tài khoản</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">Người dùng</option>
                  <option value="owner">Chủ sân</option>
                </Form.Select>
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
    </Row>
  );
};

export default Register;
EOF

# Forgot Password Page
cat > src/pages/auth/ForgotPassword.jsx << 'EOF'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      showSuccess('Email khôi phục mật khẩu đã được gửi!');
    } catch (error) {
      showError('Có lỗi xảy ra, vui lòng thử lại');
    }
    
    setLoading(false);
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-sm">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Quên mật khẩu</h2>
            
             {success ? (
              <Alert variant="success">
                Email khôi phục mật khẩu đã được gửi đến {email}. 
                Vui lòng kiểm tra hộp thư của bạn.
              </Alert>
            ) : (
              <>
                <p className="text-muted text-center mb-4">
                  Nhập email của bạn để nhận liên kết khôi phục mật khẩu
                </p>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
                  </Button>
                </Form>
              </>
            )}

            <hr />
            
            <p className="text-center mb-0">
              <Link to="/login">Quay lại đăng nhập</Link>
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
EOF

echo "Authentication pages created successfully!"
