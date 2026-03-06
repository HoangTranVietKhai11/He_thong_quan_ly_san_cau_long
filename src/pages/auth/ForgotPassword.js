import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
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

                {error && <Alert variant="danger">{error}</Alert>}

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
