'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';

const blogPosts = [
  {
    title: 'How to plan a 3 Days Thailand Trip in July 2025',
    image: '/images/blog-thailand.jpg',
  },
  {
    title: 'Why Dubai should be in your bucket list',
    image: '/images/blog-dubai.jpg',
  },
  {
    title: 'How to plan a 3 Days Thailand Trip in July 2025',
    image: '/images/blog-baku.jpg',
  },
];

export default function ReadTravelStories() {
  return (
    <section className="py-5 bg-white text-center">
      <Container>
        <h3 className="fw-bold mb-2">Read travel stories</h3>
        <p className="mb-4">From our latest blog</p>

        <Row className="justify-content-center mb-4">
          {blogPosts.map((blog, index) => (
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
