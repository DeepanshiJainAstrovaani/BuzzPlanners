// components/WhyChooseUs.tsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const features = [
  {
    title: 'Customized Itineraries',
    description:
      'Plan your own trip with customised itineraries, personalised amenities, and everything tailored just for you.',
    icon: '/images/itinerary-icon.png',
  },
  {
    title: 'Lowest Price',
    description:
      'Guaranteed lowest prices on flights, hotels & more – best deals for every travel plan! Also get discounts on booking',
    icon: '/images/best-price-icon.png',
  },
  {
    title: 'Exclusive Deals',
    description:
      'Get exclusive deals on 5-star hotels, flights, and luxury villas — only for our members! Sign up and get offers daily',
    icon: '/images/deals-icon.png',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-5" style={{ backgroundColor: '#f9fafb' }}>
      <Container>
        <div className="text-center mb-4">
          <h4 className="fw-bold">Why you should choose us?</h4>
        </div>
        
        <Row className="justify-content-center mt-4 px-5">
          {features.map((item, index) => (
            <Col md={4} className="mb-4" key={index}>
              <Card
                className="text-center p-4 shadow-sm border-0"
                style={{ background: 'linear-gradient(#e8f0f6, #e8f0f6)', borderRadius: '16px' }}
              >
                <div
                  className="mx-auto d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, #FFD966, #FDCB58)',
                  }}
                >
                  <Image src={item.icon} alt={item.title} width={70} height={70} />
                </div>
                <h5 className="fw-bold">{item.title}</h5>
                <div
                  className="mx-md-5 mx-1"
                  style={{
                    maxWidth: '250px',
                    fontSize: '15px',
                    textAlign: 'center',
                    lineHeight: '1.7',
                  }}
                >
                  <p className='fs-7'>{item.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
