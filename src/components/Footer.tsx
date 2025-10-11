'use client';
// components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <footer className="bg-dark text-white pt-5 pb-md-3 pb-1">
      <Container>
        {/* Desktop / default layout */}
        {!isMobile ? (
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
        ) : (
          /* Mobile layout */
          <Row className="mb-4 text-center">
            <Col xs={12} className="mb-3">
              <Image
                src="/buzzplannersLogo.png"
                alt="Buzz Planners Logo"
                width={120}
                height={80}
                style={{ objectFit: 'contain' }}
              />
            </Col>

            <Col xs={12} className="mb-3">
              <h6 className="fw-bold fs-6">IMPORTANT LINKS</h6>

              <div className="links-grid mt-2">
                <div>About us</div>
                <div>Hotels</div>
                <div>Policy</div>
                <div>Flights</div>
                <div>Blog</div>
                <div>Events</div>
                <div>Contact us</div>
                <div>Holidays</div>
              </div>
            </Col>

            <Col xs={12} className='lh-lg mt-3'>
              <h6 className="fw-bold fs-5">Reach us</h6>
              <p className="mb-1" style={{ fontSize: '0.875rem' }}>CB 15, Building 4, Top Floor,</p>
              <p className="mb-1" style={{ fontSize: '0.875rem' }}>Business Park, Delhi, 110053</p>
              <p className="mb-1" style={{ fontSize: '0.875rem' }}>+91 8735004354</p>
              <p className="mb-1" style={{ fontSize: '0.875rem' }}>support@buzzplanners.com</p>
            </Col>
          </Row>
        )}

        {/* Optional bottom area (keeps commented desktop social as before) */}
      </Container>

      {/* component-scoped mobile tweaks */}
      <style jsx>{`
        @media (max-width: 768px) {
          footer.bg-dark {
            padding-top: 1.75rem;
            padding-bottom: 1.75rem;
          }
          .links-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem 1rem;
            justify-items: center;
            align-items: start;
            font-size: 0.95rem;
          }
          .links-grid div {
            padding: 6px 0;
          }
        }

        /* keep desktop spacing intact */
        @media (min-width: 769px) {
          .links-grid { display: block; }
        }
      `}</style>
    </footer>
  );
}
