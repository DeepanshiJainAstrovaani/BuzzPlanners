// components/Footer.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <Container>
        <Row className="mb-4">
          {/* Left Logo & Tagline */}
          <Col md={4} className="mb-3 d-flex justify-content-center">
            <Image
              src="/buzzplannersLogo.png"
              alt="Buzz Planners Logo"
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
            />
          </Col>

          {/* Middle - Links */}
          <Col md={4} className="mb-3 col-md-4 lh-lg">
            <h6 className="fw-bold fs-4">IMPORTANT LINKS</h6>
            <Row className='fs-6'>
              <Col xs={6}>
                <p className="mb-1">About us</p>
                <p className="mb-1">Policy</p>
                <p className="mb-1">Blog</p>
                <p className="mb-1">Contact us</p>
              </Col>
              <Col xs={6}>
                <p className="mb-1">Hotels</p>
                <p className="mb-1">Flights</p>
                <p className="mb-1">Events</p>
                <p className="mb-1">Holidays</p>
              </Col>
            </Row>
          </Col>

          {/* Right - Contact Info */}
          <Col md={4} className='lh-lg'>
            <h6 className="fw-bold fs-4">Reach us</h6>
            <p className="mb-1 fs-6">CB 15, Building 4, Top Floor,</p>
            <p className="mb-1 fs-6">Business Park, Delhi, 110053</p>
            <p className="mb-1 fs-6">+91 8735004354</p>
            <p className="mb-1 fs-6">support@buzzplanners.com</p>
          </Col>
        </Row>

        {/* Bottom - Copyright & Social */}
        <Row className="align-items-center justify-content-between" style={{ paddingLeft: '6rem', paddingRight: '12rem' }}>
          <Col md={6} className="text-md-start text-center col-md-6">
            <small className='fs-6'>Buzz Planners Pvt Ltd © 2025 Rights Reserved</small>
          </Col>
          <Col md={6} className="text-md-end text-center mt-3 mt-md-0">
            <Image
              src="/images/instagram-icon.png"
              alt="Instagram"
              width={30}
              height={30}
              className="me-3"
            />
            <Image
              src="/images/meta-icon.png"
              alt="Meta"
              width={30}
              height={30}
            />
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
