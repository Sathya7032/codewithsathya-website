import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Button } from 'react-bootstrap';
import { Envelope, Facebook, House, Instagram, Linkedin, Phone, TwitterX } from 'react-bootstrap-icons';
import { Book, JournalText, CodeSlash, Megaphone } from 'react-bootstrap-icons';
import { useAuth } from '../auth/auth';
import UserProfileModal from './UserProfileModal'; // Import the modal
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from "../auth/token";
import axios from 'axios';

const HeaderWithNavbar = () => {
  const { isAuthorized, logout } = useAuth();
const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  

   const fetchGoogleUserProfile = async (setUser) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  console.log("📦 JWT Token:", token);

  if (!token) {
    console.warn("⚠️ No JWT token found in localStorage.");
    return null;
  }

  try {
    const response = await axios.get("https://codewithsathya.pythonanywhere.com/api/auth/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      console.log("✅ User data from JWT:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser && setUser(response.data); // ✅ Only call if setUser exists
      return response.data;
    }
  } catch (error) {
    console.error(
      "❌ Failed to fetch user profile with JWT:",
      error.response?.data || error.message
    );
    return null;
  }
};

  
    useEffect(() => {
  fetchGoogleUserProfile(setUser);
}, []);

  
  const getEmailInitials = (email) => {
    if (!email) return '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Top Header Bar with Contact Info */}
      <div className="text-white py-2 d-none d-md-block" style={{backgroundColor:"darkslategray"}}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <Envelope className="me-2" />
                <span className="me-3">codewithsathya4@gmail.com</span>
                <Phone className="me-2" />
                <span>+91 8519965746</span>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="d-inline-flex">
                <a href="/" className="text-white me-3">
                  <Facebook/>
                </a>
                <a href="/" className="text-white me-3">
                  <TwitterX/>
                </a>
                <a href="/" className="text-white me-3">
                  <Linkedin/>
                </a>
                <a href="/" className="text-white">
                  <Instagram/>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="fw-bold">
            <span style={{color:'darkslategray'}} className="fs-4">CodeWithSathya</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" className="mx-2 d-flex align-items-center">
                <House className="me-1" />
                <span>Home</span>
              </Nav.Link>
              <Nav.Link href="/tutorials" className="mx-2 d-flex align-items-center">
                <Book className="me-1" />
                <span>Tutorials</span>
              </Nav.Link>
              
              <Nav.Link href="/blogs" className="mx-2 d-flex align-items-center">
                <JournalText className="me-1" />
                <span>Blogs</span>
              </Nav.Link>
              
              <Nav.Link href="/code-snippets" className="mx-2 d-flex align-items-center">
                <CodeSlash className="me-1" />
                <span>Code Snippets</span>
              </Nav.Link>
              
              {isAuthorized ? (
                <>
                  <div 
                    className="mx-2 d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowProfileModal(true)}
                  >
                    <div 
                      style={{
                        backgroundColor: 'tomato',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        borderColor: 'darkblue',
                        fontWeight: 'bold',
                      }}
                    >
                      {getEmailInitials(user?.email)}
                    </div>
                  </div>
                  <UserProfileModal 
                    show={showProfileModal}
                    onHide={() => setShowProfileModal(false)}
                    user={user}
                  />
                </>
              ) : (
                <Button 
                  href="/login" 
                  variant="outline-dark"
                  style={{
                    borderColor: 'darkslategray',
                    color: 'darkslategray',
                    marginLeft: '8px'
                  }}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderWithNavbar;
