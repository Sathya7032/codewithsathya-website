import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Facebook, Twitter, Linkedin, Instagram, Github, 
  Book, Laptop, Award, Headset, Envelope, GeoAlt, Telephone,
  JournalText
} from 'react-bootstrap-icons';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="bg-light text-dark pt-5 pb-4">
      <Container>
        <Row className="mb-4">
          {/* About Section */}
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-4">
              <Laptop className="me-2" />
              EduSite
            </h5>
            <p className="text-muted">
              Empowering learners with quality education through innovative 
              technology and comprehensive resources.
            </p>
            <div className="mt-4">
              <a href="/" className="text-info me-3 footer-social-icon">
                <Facebook size={20} />
              </a>
              <a href="/" className="text-primary me-3 footer-social-icon">
                <Twitter size={20} />
              </a>
              <a href="/" className="text-info me-3 footer-social-icon">
                <Linkedin size={20} />
              </a>
              <a href="/" className="text-danger me-3 footer-social-icon">
                <Instagram size={20} />
              </a>
              <a href="/" className="text-black footer-social-icon">
                <Github size={20} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/tutorials" className="text-muted footer-link">
                  <Book className="me-2" size={14} />
                  Tutorials
                </a>
              </li>
              <li className="mb-2">
                <a href="/courses" className="text-muted footer-link">
                  <Award className="me-2" size={14} />
                  Courses
                </a>
              </li>
              <li className="mb-2">
                <a href="/blog" className="text-muted footer-link">
                  <JournalText className="me-2" size={14} />
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="/support" className="text-muted footer-link">
                  <Headset className="me-2" size={14} />
                  Support
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-4">Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-3 d-flex align-items-center">
                <GeoAlt className="me-3" size={16} />
                <span>123 Education St, Learning City, 10101</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <Envelope className="me-3" size={16} />
                <span>codewithsathya4@gmail.com</span>
              </li>
              <li className="d-flex align-items-center">
                <Telephone className="me-3" size={16} />
                <span>+91 8519965746</span>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={3} md={6}>
            <h5 className="text-uppercase fw-bold mb-4">Newsletter</h5>
            <p className="text-muted">Subscribe to get updates on new courses and resources.</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control bg-secondary border-0 text-white" 
                placeholder="Your Email" 
                aria-label="Your Email" 
              />
              <button 
                className="btn btn-primary" 
                type="button"
              >
                Subscribe
              </button>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="pt-3 border-top border-secondary">
          <Col md={6} className="text-center text-md-start">
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} codewithsathya. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-muted small mb-0">
              <a href="/privacy" className="text-muted footer-link me-3">Privacy Policy</a>
              <a href="/terms" className="text-muted footer-link me-3">Terms of Service</a>
              <a href="/sitemap" className="text-muted footer-link">Sitemap</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
