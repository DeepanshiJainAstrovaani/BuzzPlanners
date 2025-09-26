'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import travellerImg from '../../public/images/traveller.png';
import { useExperience, type Experience } from '@/context/ExperienceContext';

const tabOptions: Experience[] = ['flights', 'events', 'hotels', 'trips', 'holiday'];

function getDealsFor(exp: Experience) {
  // Swap offer cards per experience using available assets
  switch (exp) {
    case 'flights':
      return [
        { src: '/images/deal1.png', alt: 'Flight Offer 1' },
        { src: '/images/deal2.png', alt: 'Flight Offer 2' },
      ];
    case 'hotels':
      return [
        { src: '/images/stay1.png', alt: 'Hotel Offer 1' },
        { src: '/images/stay2.jpg', alt: 'Hotel Offer 2' },
      ];
    case 'holiday':
      return [
        { src: '/images/stay3.jpg', alt: 'Holiday Offer 1' },
        { src: '/images/stay4.jpg', alt: 'Holiday Offer 2' },
      ];
    case 'trips':
      return [
        { src: '/images/stay5.jpg', alt: 'Trips Offer 1' },
        { src: '/images/stay2.jpg', alt: 'Trips Offer 2' },
      ];
    case 'events':
    default:
      return [
        { src: '/images/blog-dubai.jpg', alt: 'Event Offer 1' },
        { src: '/images/blog-thailand.jpg', alt: 'Event Offer 2' },
      ];
  }
}

export default function ExclusiveDeals() {
  const { active, setActive } = useExperience();
  const deals = getDealsFor(active);

  return (
    <section className="bg-light">
      <Container>
        {/* Full-width Headline */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold text-center">Exclusive Deals</h2>
          </Col>
        </Row>

        {/* Main Two Column Layout */}
        <Row className="align-items-start">
          {/* Left Image Column */}
          <Col md={4} className="text-center mb-4 mb-md-0">
            <Image
              src={travellerImg}
              alt="Traveller"
              style={{ width: '40rem', height: 'auto' }}
            />
          </Col>

          {/* Right Column with filters, carousel and CTA */}
          <Col md={8}>
            {/* Filter Tabs tied to global experience */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {tabOptions.map((tab) => (
                <Button
                  key={tab}
                  variant={active === tab ? 'success' : 'light'}
                  className="rounded-pill px-4 py-1 fw-medium text-capitalize"
                  onClick={() => setActive(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Offer Cards */}
            <Row className="mb-4 g-4">
              <Col xs={6}>
                <Image src={deals[0].src} alt={deals[0].alt} className="img-fluid rounded-4" style={{ borderRadius: '12px' }} width={500} height={300}/>
              </Col>
              <Col xs={6}>
                <Image src={deals[1].src} alt={deals[1].alt} className="img-fluid rounded-4" style={{ borderRadius: '12px' }} width={500} height={300}/>
              </Col>
            </Row>

            {/* CTA Button */}
            <div>
              <Button variant="success" className="px-5 py-2 fw-bold rounded-pill">
                See offers
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
