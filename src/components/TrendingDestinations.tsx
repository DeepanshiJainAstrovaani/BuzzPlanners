'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

const destinations = [
  {
    name: 'Thailand',
    image: '/images/thailand.png', // Replace with your actual image path
  },
  {
    name: 'Goa',
    image: '/images/goa.png',
  },
  {
    name: 'Dubai',
    image: '/images/dubai.png',
  },
  {
    name: 'Bali',
    image: '/images/bali.png',
  },
  {
    name: 'Nepal',
    image: '/images/nepal.png',
  },
];

export default function TrendingDestinations() {
  return (
    <section className="py-5 bg-white text-center" style={{ border: '1px solid #ccc7c7', borderRight: 'none'}}>
      <Container>
        <h4 className="fw-bold">Trending Destinations</h4>
        <p className="text-muted">Book your customized trip</p>

        <Row className="justify-content-center mt-4">
          {destinations.map((dest, index) => (
            <Col key={index} xs={6} sm={4} md={2} className="mb-4 d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-2">
                <Image src={dest.image} alt={dest.name} width={200} height={200} objectFit="contain" style={{ width: '10rem', height: '10rem'}} />
              </div>
              <div className="fw-medium">{dest.name}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
