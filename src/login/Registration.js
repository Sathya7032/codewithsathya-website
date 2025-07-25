import React, { useState } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GoogleLogin.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setApiError('');
      
      const response = await axios.post('https://codewithsathya.pythonanywhere.com/api/users/', formData);
      
      if (response.status === 201) {
        navigate('/login', { state: { registrationSuccess: true } });
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        if (err.response.data.username) {
          setErrors(prev => ({ ...prev, username: err.response.data.username[0] }));
        }
        if (err.response.data.email) {
          setErrors(prev => ({ ...prev, email: err.response.data.email[0] }));
        }
        setApiError(err.response.data.detail || 'Registration failed. Please try again.');
      } else {
        setApiError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="auth-card shadow-lg">
        <Card.Body className="p-5">
          <Row className="justify-content-center mb-4">
            <Col xs="auto">
              <div className="app-logo">
                <i className="bi bi-person-plus"></i>
              </div>
            </Col>
          </Row>
          
          <h2 className="text-center mb-4">Create Account</h2>
          <p className="text-center text-muted mb-4">
            Join us today to get started
          </p>
          
          {apiError && (
            <Alert variant="danger" className="text-center">
              {apiError}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    isInvalid={!!errors.first_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    isInvalid={!!errors.last_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                At least 8 characters
              </Form.Text>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                className="register-btn"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Creating account...</span>
                  </>
                ) : 'Register'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <p className="text-muted small">
              Already have an account? <a href="/login" className="text-link">Sign in</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registration;