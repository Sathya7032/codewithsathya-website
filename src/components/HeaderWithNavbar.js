import React from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Envelope, Facebook, House, Instagram, Linkedin, Phone, TwitterX } from 'react-bootstrap-icons';
import { Book, JournalText, CodeSlash, Megaphone } from 'react-bootstrap-icons';


const HeaderWithNavbar = () => {
  return (
    <>
      {/* Top Header Bar with Contact Info */}
      <div className="text-white py-2 d-none d-md-block" style={{backgroundColor:"darkslategray"}}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <Envelope className="me-2" />
                <span className="me-3">contact@edusite.com</span>
                <Phone className="me-2" />
                <span>+1 (123) 456-7890</span>
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
              
              <Nav.Link href="/tech-updates" className="mx-2 d-flex align-items-center">
                <Megaphone className="me-1" />
                <span>Tech Updates</span>
              </Nav.Link>
            </Nav>
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default HeaderWithNavbar;