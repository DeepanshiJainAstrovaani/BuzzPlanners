'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useExperience } from '@/context/ExperienceContext';

const postsByExperience: Record<string, { title: string; image: string }[]> = {
  flights: [
    { title: 'How to plan a 3 Days Thailand Trip in July 2025', image: '/images/blog-thailand.jpg' },
    { title: 'Why Dubai should be in your bucket list', image: '/images/blog-dubai.jpg' },
    { title: 'Top 5 hacks to find cheapest flights', image: '/images/blog-baku.jpg' },
  ],
  hotels: [
    { title: '10 Dream stays in the Himalayas', image: '/images/stay1.png' },
    { title: 'Boutique hotels you must try in 2025', image: '/images/stay3.jpg' },
    { title: 'How to pick the perfect hotel room', image: '/images/stay4.jpg' },
  ],
  holiday: [
    { title: 'Family-friendly hill stations near Delhi', image: '/images/stay5.jpg' },
    { title: 'Weekend getaways you’ll love', image: '/images/stay2.jpg' },
    { title: 'Crafting your custom itinerary 101', image: '/images/blog-thailand.jpg' },
  ],
  trips: [
    { title: 'Road trips from Delhi under 6 hours', image: '/images/goa.png' },
    { title: 'How to budget a group trip', image: '/images/bali.png' },
    { title: 'Must-pack list for your next trip', image: '/images/nepal.png' },
  ],
  events: [
    { title: 'Choosing the right venue for your event', image: '/images/blog-dubai.jpg' },
    { title: 'Wedding planning essentials', image: '/images/blog-baku.jpg' },
    { title: 'Corporate events: a quick checklist', image: '/images/blog-thailand.jpg' },
  ],
};

export default function ReadTravelStories() {
  const { active } = useExperience();
  const posts = postsByExperience[active] ?? postsByExperience.flights;

  const title =
    active === 'events'
      ? 'Read event stories'
      : active === 'hotels'
      ? 'Read stay stories'
      : 'Read travel stories';
  const subtitle =
    active === 'events' ? 'From our latest event blog' : 'From our latest blog';

  return (
    <section className="py-5 bg-white text-center">
      <Container>
        <h4 className="fw-bold">{title}</h4>
        <p className="text-muted">{subtitle}</p>

        <Row className="justify-content-center mb-4">
          {posts.map((blog, index) => (
            <Col key={index} xs={12} md={4} className="mb-3">
              <div className="text-start">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={240}
                  className="w-100 rounded-4 mb-2 object-fit-cover"
                  style={{ height: '190px' }}
                />
                <p className="fw-medium">{blog.title}</p>
              </div>
            </Col>
          ))}
        </Row>

        <Button
          variant="success"
          className="rounded-pill px-4 py-2 fw-semibold"
          style={{ backgroundColor: '#14A15F', border: 'none' }}
        >
          See more
        </Button>
      </Container>
    </section>
  );
}
