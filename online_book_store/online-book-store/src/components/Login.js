import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';

const Login = ({ onLogin, onSwitchToRegister, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onLogin(formData);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">📚 Login to Bookstore</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Email Address <span style={{ color: 'red' }}>*</span>
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    isInvalid={!!formErrors.email}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password <span style={{ color: 'red' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    isInvalid={!!formErrors.password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>

                <hr />

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={onSwitchToRegister}
                      disabled={loading}
                    >
                      Create Account
                    </Button>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

         
        </Col>
      </Row>
    </Container>
  );
};

export default Login;