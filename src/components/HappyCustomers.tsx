'use client';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Image from 'next/image';

export default function HappyCustomers() {
  return (
    <section className="py-5" style={{ backgroundColor: '#f9f9f9' }}>
      <Container>
        {/* Section Heading */}
        <h2 className="text-center fw-bold mb-2">See what our happy customers say</h2>

        {/* Blue Card */}
        <Card
          className="p-4 mt-4 border-0 rounded-4"
          style={{ backgroundColor: '#DDEFF7' }}
        >
          <Row className="align-items-start gy-4">
            {/* Left - Main & Thumbnails */}
            <Col md={4}>
              <Image
                src="/images/blog-thailand.jpg"
                alt="Main trip"
                width={310}
                height={200}
                style={{ borderRadius: '12px'}}
              />
              <div className="d-flex gap-2 mt-3">
                <Image
                  src="/images/blog-thailand.jpg"
                  alt="Small 1"
                  width={150}
                  height={110}
                  style={{ borderRadius: '10px', objectFit: 'cover' }}
                />
                <Image
                  src="/images/blog-thailand.jpg"
                  alt="Small 2"
                  width={150}
                  height={110}
                  style={{ borderRadius: '10px', objectFit: 'cover' }}
                />
              </div>
            </Col>

            {/* Right - Testimonial Info */}
            <Col md={8}>
              <h5 className="fw-bold mb-1 fs-3">Vijay Mahana and family in Thailand</h5>
              <p className="text-success mb-2 fs-4">Thailand Trip , 20 Jun 2025</p>
              <p className="text-dark mb-0 fs-4" style={{ lineHeight: '1.6' }}>
                Our family trip to Thailand was absolutely amazing, all thanks to Buzz Planners! The 3 days, 2 nights customized
                package was perfectly planned, smooth, and hassle-free. Every detail was taken care of with personal attention. We’re
                fully satisfied and truly grateful. Thank you so much, Buzz Planners!
              </p>

              {/* Stars */}
              <div className="d-flex align-items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#FEC107', fontSize: '2.6rem' }}>★</span>
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
    </section>
  );
}
