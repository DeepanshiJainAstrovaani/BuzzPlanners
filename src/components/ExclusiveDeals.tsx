'use client';

import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';

export default function ExclusiveDeals() {
  const deals = [
    {
      id: 1,
      image: '/deals/goa.png',
      tag: '50% OFF',
      title: 'Romantic Getaway in Goa',
      desc: '3N/4D - Beach Resort with Breakfast',
      price: '₹12,499',
    },
    {
      id: 2,
      image: '/deals/manali.png',
      tag: 'Flat ₹3000 OFF',
      title: 'Snowy Escape to Manali',
      desc: '2N/3D - Includes Sightseeing',
      price: '₹8,999',
    },
    {
      id: 3,
      image: '/deals/jaipur.png',
      tag: '20% OFF',
      title: 'Royal Jaipur Tour',
      desc: '2N/3D - Heritage Hotels',
      price: '₹10,499',
    },
  ];

  return (
    <section style={{ backgroundColor: '#f5f5f5', padding: '3rem 0' }}>
      <Container>
        <div className="text-center mb-5">
          <h3 className="fw-bold" style={{ color: '#2D3E2E' }}>
            Exclusive Deals Just for You
          </h3>
          <p className="text-muted">Handpicked packages at unbeatable prices</p>
        </div>
        <Row className="g-4">
          {deals.map((deal) => (
            <Col key={deal.id} xs={12} md={4}>
              <Card className="shadow-sm h-100">
                <div style={{ position: 'relative' }}>
                  <Card.Img variant="top" src={deal.image} style={{ borderRadius: '10px 10px 0 0' }} />
                  <Badge
                    bg="success"
                    className="position-absolute top-0 start-0 m-2 rounded-pill px-3 py-1"
                    style={{ fontSize: '12px' }}
                  >
                    {deal.tag}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-bold">{deal.title}</Card.Title>
                    <Card.Text className="text-muted small">{deal.desc}</Card.Text>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="fw-bold" style={{ fontSize: '1.1rem', color: '#14A15F' }}>{deal.price}</div>
                    <Button variant="success" size="sm" style={{ backgroundColor: '#147C2B' }}>
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
