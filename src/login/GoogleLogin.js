import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./GoogleLogin.css";
import { FcGoogle, FcLock } from "react-icons/fc";
import { useAuth } from "../auth/auth";

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Google Login
  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const success = await login({ google_token: tokenResponse.access_token });
        if (success) {
          navigate("/", { replace: true });
        } else {
          setError("Google login failed.");
        }
      } catch (err) {
        console.error("❌ Google login error:", err);
        setError("Google login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login failed."),
  });

  // Username & Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(formData);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="auth-card shadow-lg">
        <Card.Body className="p-5">
          <Row className="justify-content-center mb-4">
            <Col xs="auto">
              <div className="app-logo">
                <FcLock />
              </div>
            </Col>
          </Row>

          <h2 className="text-center mb-4">Welcome Back</h2>
          <p className="text-center text-muted mb-4">
            Sign in with your Google account or your credentials
          </p>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          {/* Username/Password Login Form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </Form>

          <hr className="my-4" />

          {/* Google Login Button */}
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              onClick={() => loginWithGoogle()}
              disabled={loading}
              className="google-btn"
            >
              <FcGoogle size={20}/><span style={{paddingLeft: 10}}></span>
                Continue with Google
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted small">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GoogleLogin;
