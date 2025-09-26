'use client';

import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useExperience } from '@/context/ExperienceContext';

const flights = [
  { name: 'Thailand', image: '/images/thailand.png' },
  { name: 'Goa', image: '/images/goa.png' },
  { name: 'Dubai', image: '/images/dubai.png' },
  { name: 'Bali', image: '/images/bali.png' },
  { name: 'Nepal', image: '/images/nepal.png' },
];

const hotels = [
  { name: 'Manali', image: '/images/stay1.png' },
  { name: 'Nainital', image: '/images/stay2.jpg' },
  { name: 'Mussoorie', image: '/images/stay3.jpg' },
  { name: 'Rishikesh', image: '/images/stay4.jpg' },
  { name: 'Chandigarh', image: '/images/stay5.jpg' },
];

const events = [
  { name: 'Dubai Expo', image: '/images/blog-dubai.jpg' },
  { name: 'Thailand Fest', image: '/images/blog-thailand.jpg' },
  { name: 'Baku Summit', image: '/images/blog-baku.jpg' },
  { name: 'Bali Carnival', image: '/images/bali.png' },
  { name: 'Goa Carnival', image: '/images/goa.png' },
];

export default function TrendingDestinations() {
  const { active } = useExperience();
  const data = active === 'flights' ? flights : active === 'hotels' ? hotels : active === 'events' ? events : flights;
  const title = active === 'events' ? 'Trending Events' : active === 'hotels' ? 'Trending Stays' : 'Trending Destinations';
  const subtitle = active === 'events' ? 'Discover top events worldwide' : 'Book your customized trip';

  return (
    <section className="py-5 bg-white text-center" style={{ border: '1px solid #ccc7c7', borderRight: 'none'}}>
      <Container>
        <h4 className="fw-bold">{title}</h4>
        <p className="text-muted">{subtitle}</p>

        <Row className="justify-content-center mt-4">
          {data.map((dest, index) => (
            <Col key={index} xs={6} sm={4} md={2} className="mb-4 d-flex flex-column align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-2">
                <Image src={dest.image} alt={dest.name} width={200} height={200} style={{ width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div className="fw-medium">{dest.name}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
