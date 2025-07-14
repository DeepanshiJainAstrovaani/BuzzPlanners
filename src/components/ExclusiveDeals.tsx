'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import travellerImg from '../../public/images/traveller.png'; // replace with your image
import flightOfferImg from '../../public/images/deal1.png'; // replace with your image
import hourlyRentalImg from '../../public/images/deal2.png';

const tabOptions = ['Flights', 'Events', 'Hotels', 'Trips', 'Holiday'];

const offers = [
  {
    title: 'New User Offer on',
    highlight: 'First Flight',
    code: 'EMTFIRST',
    image: flightOfferImg,
    bgColor: '#0D6EFD'
  },
  {
    title: 'Grab 10% OFF* on',
    highlight: 'Hourly Rentals',
    code: 'EMTHOURLY',
    image: hourlyRentalImg,
    bgColor: '#B857F6'
  }
];

export default function ExclusiveDeals() {
  const [activeTab, setActiveTab] = useState('Flights');

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
          <Col md={4} className="text-center">
            <Image
              src={travellerImg}
              alt="Traveller"
              style={{ width: '40rem', height: 'auto' }}
            />
          </Col>

          {/* Right Column with filters, carousel and CTA */}
          <Col md={8}>
            {/* Filter Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {tabOptions.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'success' : 'light'}
                  className="rounded-pill px-4 py-1 fw-medium"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Carousel-like Offer Cards */}
            <Row className="mb-4 g-4">
              <Col xs={6}>
                <Image src="/images/deal1.png" alt="First Flight Offer" className="img-fluid rounded-4" style={{ borderRadius: '12px' }} width={500} height={300}/>
              </Col>
              <Col xs={6}>
                <Image src="/images/deal2.png" alt="Hourly Rentals Offer" className="img-fluid rounded-4" style={{ borderRadius: '12px' }}  width={500} height={300}/>
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
