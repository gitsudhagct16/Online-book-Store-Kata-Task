import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';

const Register = ({ onRegister, onSwitchToLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword, ...registrationData } = formData;
      await onRegister(registrationData);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h4 className="mb-0">📚 Create Account</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    isInvalid={!!formErrors.name}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
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

                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    isInvalid={!!formErrors.password}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    isInvalid={!!formErrors.confirmPassword}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="success"
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                <hr />

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={onSwitchToLogin}
                      disabled={loading}
                    >
                      Sign In
                    </Button>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* <div className="text-center mt-3">
            <small className="text-muted">
              🔒 Your information is secure and encrypted
            </small>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;