'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Image from 'next/image';

export default function HappyCustomers() {
  const gallery = [
    '/images/blog-thailand.jpg',
    '/images/blog-thailand.jpg', // if missing, will fallback to first image visually
    '/images/blog-thailand.jpg',
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isMobile, gallery.length]);

  // ensure safe index
  const currentImage = gallery[slideIndex % gallery.length] || gallery[0];

  return (
    <section className="py-md-5 px-md-5 py-2 px-2" style={{ backgroundColor: '#f9f9f9' }}>
      <Container>
        <div className="text-center mb-4">
          <h4 className="fw-bold">See what our happy customers say</h4>
        </div>

        {/* Blue Card */}
        <Card className="p-4 mt-4 border-0 rounded-4" style={{ backgroundColor: '#DDEFF7' }}>
          <Row className="align-items-start gy-4">
            {/* Left - Main & Thumbnails (desktop) / Slider (mobile) */}
            <Col md={4}>
              {isMobile ? (
                // Mobile: single-image slider (full width)
                <div style={{ width: '100%', overflow: 'hidden', borderRadius: 12 }}>
                  <img
                    src={currentImage}
                    alt="Customer trip"
                    style={{
                      width: '100%',
                      height: 220,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      borderRadius: 12,
                    }}
                  />
                </div>
              ) : (
                <>
                  <Image
                    src={gallery[0]}
                    alt="Main trip"
                    width={310}
                    height={200}
                    style={{ borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div className="d-flex gap-2 mt-3">
                    <div style={{ width: 150, height: 110, overflow: 'hidden', borderRadius: 10 }}>
                      <Image
                        src={gallery[0]}
                        alt="Small 1"
                        width={150}
                        height={110}
                        style={{ borderRadius: '10px', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ width: 150, height: 110, overflow: 'hidden', borderRadius: 10 }}>
                      <Image
                        src={gallery[1] || gallery[0]}
                        alt="Small 2"
                        width={150}
                        height={110}
                        style={{ borderRadius: '10px', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </>
              )}
            </Col>

            {/* Right - Testimonial Info */}
            <Col md={8}>
              <h5 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>
                Vijay Mahana and family in Thailand
              </h5>
              <p className="text-success mb-3" style={{ fontSize: '1rem', fontWeight: '500' }}>
                Thailand Trip , 20 Jun 2025
              </p>
              <p className="text-dark mb-3" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                Our family trip to Thailand was absolutely amazing, all thanks to Buzz Planners! The 3 days, 2 nights customized
                package was perfectly planned, smooth, and hassle-free. Every detail was taken care of with personal attention. We're
                fully satisfied and truly grateful. Thank you so much, Buzz Planners!
              </p>

              {/* Stars */}
              <div className="d-flex align-items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#FEC107', fontSize: '1.4rem' }}>
                    ★
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Pagination Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button style={{ backgroundColor: '#F5F5F5', color: '#999999' }} variant="light" className="px-4 rounded-pill fw-semibold" disabled>
            Previous
          </Button>
          <Button style={{ backgroundColor: '#14A15F' }} className="px-4 rounded-pill fw-semibold border-0">
            Next
          </Button>
        </div>
      </Container>

      <style jsx>{`
        @media (max-width: 600px) {
          section :global(.card) { padding: 1rem; }
        }
      `}</style>
    </section>
  );
}
