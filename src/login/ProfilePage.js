import React from "react";
import { useAuth } from "../auth/auth";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

const ProfilePage = () => {
  const { user, logout, isAuthorized } = useAuth();
  console.log("user details ", user, isAuthorized)

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <h3>Loading profile...</h3>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-3">Profile Info</h3>

        <Row className="mb-2">
          <Col xs={4}><strong>Email:</strong></Col>
          <Col>{user.email}</Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}><strong>First Name:</strong></Col>
          <Col>{user.first_name || user.given_name || '-'}</Col>
        </Row>

        <Row className="mb-2">
          <Col xs={4}><strong>Last Name:</strong></Col>
          <Col>{user.last_name || user.family_name || 'No Last name '}</Col>
        </Row>

        {user.picture && (
          <Row className="mb-3 text-center">
            <Col>
              <img src={user.picture} alt="profile" width="100" height="100" className="rounded-circle" />
            </Col>
          </Row>
        )}

        <div className="d-grid mt-3">
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default ProfilePage;
