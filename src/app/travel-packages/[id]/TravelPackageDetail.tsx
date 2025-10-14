/* eslint-disable react-hooks/exhaustive-deps   */
'use client';

import React, { useEffect, useRef, useState } from 'react';

// If you have an API for fetching details by id, import here
// import { fetchTravelPackageById } from '@/api/getTravelPackages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge, Button, Card, Carousel } from 'react-bootstrap';
import Image from 'next/image';

const dummyPackageDetails = {
  id: '1',
  title: 'Thailand Group Party 3 Days Trip',
  duration: '3 Days 2 Night',
  rating: 4.5,
  originalPrice: 35500,
  discountedPrice: 25500,
  images: [
    '/images/TravelImage.png',
    '/images/TravelImage.png',
    '/images/TravelImage.png',
  ],
  overview: `Embark on an unforgettable 3 Days 2 Nights Thailand getaway starting and ending in Delhi. Thailand, known as the "Land of Smiles," offers a perfect blend of tropical beauty, vibrant culture, and thrilling experiences. From exploring bustling Bangkok markets to relaxing on exotic beaches or enjoying vibrant nightlife and delicious Thai cuisine, every moment is filled with excitement. Discover ornate temples, shop for souvenirs, or indulge in water sports and spa therapies. This short yet power-packed trip is ideal for couples, friends, or families looking for a quick international escape. Fly from Delhi and return with memories that last forever.`,
  itinerary: [
    {
      day: 'Day 1: Delhi to Bangkok – Arrival & Local Sightseeing',
      details: [
        'Morning: Flight from Delhi to Bangkok (4.5–5.5 hrs)',
        'Afternoon: Arrive in Bangkok, airport pick-up, check-in to hotel',
        'Evening: Explore Bangkok city',
        '• Visit Wat Arun, Wat Pho, and drive past Grand Palace',
        '• Visit Asiatique Riverfront Market (ideal for shopping & riverside dinner)',
        'Night: Return to hotel, overnight stay in Bangkok'
      ],
      images: ['/images/stay1.png', '/images/stay2.jpg', '/images/stay5.jpg']
    },
    {
      day: 'Day 2: Coral Island Tour & Pattaya Exploration',
      details: [
        'Morning: Coral Island tour and water sports',
        'Evening: Return to Bangkok, explore nightlife',
        'Night: Return to hotel, overnight stay'
      ],
      images: ['/images/stay2.jpg', '/images/stay1.png']
    },
    {
      day: 'Day 3: Bangkok to Delhi – Departure',
      details: [
        'Morning: Check-out from hotel, last-minute shopping',
        'Afternoon: Airport transfer and departure',
        'Evening: Arrive in Delhi with wonderful memories'
      ],
      images: ['/images/stay3.jpg', '/images/stay4.jpg']
    }
  ],
  inclusions: [
    'Return flights from Delhi to Bangkok',
    '2 nights accommodation in 3-star hotel',
    'Daily breakfast',
    'Airport transfers',
    'City tour with guide',
    'Coral Island tour',
    'All taxes and service charges'
  ],
  exclusions: [
    'Lunch and dinner (except breakfast)',
    'Personal expenses',
    'Travel insurance',
    'Visa fees',
    'Tips and gratuities',
    'Optional activities'
  ],
  policies: [
    'Booking: 25% advance payment required',
    'Cancellation: 15 days before travel - 25% charges apply',
    'Cancellation: 7 days before travel - 50% charges apply',
    'Cancellation: 48 hours before travel - 100% charges apply',
    'No refund for no-shows',
    'Travel insurance recommended',
    'Valid passport required with 6 months validity'
  ]
};

export default function TravelPackageDetail({ params }: { params: Promise<{ id: string }> }) {
  const [pkg, setPkg] = useState<any>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    itinerary: useRef<HTMLDivElement>(null),
    inclusion: useRef<HTMLDivElement>(null),
    policy: useRef<HTMLDivElement>(null),
  };

  type SectionKey = keyof typeof sectionRefs;

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    // In a real app, you'd fetch data based on resolvedParams.id
    // For now, using dummy data
    setPkg(dummyPackageDetails);
  }, [resolvedParams]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionKeys: SectionKey[] = ['overview', 'itinerary', 'inclusion', 'policy'];
      
      const sections = sectionKeys.map(key => ({
        key,
        offset: sectionRefs[key].current
          ? sectionRefs[key].current!.getBoundingClientRect().top + window.scrollY
          : 0
      }))
        .filter(section => section.offset <= window.scrollY + 200)
        .sort((a, b) => b.offset - a.offset)[0];

      if (sections) {
        setActiveTab(sections.key);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, sectionRefs]);

  const scrollToSection = (key: SectionKey) => {
    const section = sectionRefs[key]?.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!pkg) {
    return (
      <div>
        <Header />
        <div className="container mt-5 pt-5">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="px-md-5">

      {/* Hero Section */}
      <div style={{ paddingTop: '80px' }}>
        <div className="container-fluid px-0">
          {/* Breadcrumb */}
          <div className="mb-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/travel-packages">Travel Packages</a></li>
                <li className="breadcrumb-item active" aria-current="page">Thailand</li>
              </ol>
            </nav>
          </div>

          {/* Title and Duration */}
          <div className="mb-4">
            <div className="row">
              <div className="col-lg-8">
                <h1 className="fw-bold mb-2">{pkg.title}</h1>
                <div className="d-flex align-items-center mb-3">
                  <Badge 
                    bg="primary" 
                    className="me-3 px-3 py-2" 
                    style={{ fontSize: '14px', backgroundColor: '#007bff' }}
                  >
                    {pkg.duration}
                  </Badge>
                  <div className="d-flex align-items-center">
                    <span className="text-warning me-1" style={{ fontSize: '16px' }}>★</span>
                    <span className="fw-semibold">{pkg.rating} Star</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Image Carousel */}
          <div className="position-relative mb-4">
            <Carousel indicators={false} className="travel-carousel">
              {pkg.images.map((image: string, index: number) => (
                <Carousel.Item key={index}>
                  <Image
                    src={image}
                    alt={`Package image ${index + 1}`}
                    width={1200}
                    height={500}
                    className="d-block w-100"
                    style={{ objectFit: 'cover', height: '500px' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-top border-bottom py-3 sticky-top" style={{ top: '70px', zIndex: 10 }}>
        <div className="container">
          <div className="d-flex gap-2 overflow-auto">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'itinerary', label: 'Itinerary' },
              { key: 'inclusion', label: 'Inclusions' },
              { key: 'policy', label: 'Policies' }
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`btn ${activeTab === key ? 'btn-primary' : 'btn-outline-secondary'} px-4 py-2 rounded-pill fw-semibold`}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: activeTab === key ? '#007bff' : 'transparent',
                  borderColor: activeTab === key ? '#007bff' : '#6c757d',
                  color: activeTab === key ? 'white' : '#6c757d'
                }}
                onClick={() => scrollToSection(key as SectionKey)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            {/* Price and Book Section - Mobile */}
            <div className="d-lg-none mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="h5 fw-bold me-2">Starts From</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span className="text-muted text-decoration-line-through me-2 h6">
                      ₹{pkg.originalPrice.toLocaleString()}
                    </span>
                    <span className="h4 fw-bold mb-0" style={{ color: '#28a745' }}>
                      ₹{pkg.discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <small className="text-muted d-block mb-3">Price Per Person</small>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      className="flex-fill"
                      style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                    >
                      BOOK NOW
                    </Button>
                    <Button variant="outline-primary" className="flex-fill">
                      SEND ENQUIRY
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
            {/* Overview Section */}
            <section ref={sectionRefs.overview} className="mb-5">
              <h2 className="fw-bold mb-4">Overview</h2>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {pkg.overview}
              </p>
            </section>

            {/* Itinerary Section */}
            <section ref={sectionRefs.itinerary} className="mb-5">
              <h2 className="fw-bold mb-4">Detailed Itinerary</h2>
              {pkg.itinerary.map((day: any, index: number) => (
                <Card key={index} className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold text-primary mb-3">{day.day}</h5>
                    <div className="row">
                      <div className="col-md-8">
                        <ul className="list-unstyled">
                          {day.details.map((detail: string, i: number) => (
                            <li key={i} className="mb-2 text-muted">
                              {detail.startsWith('•') ? (
                                <span className="ms-3">{detail}</span>
                              ) : (
                                <span className="fw-semibold">{detail}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex gap-2 flex-wrap">
                          {day.images.map((image: string, i: number) => (
                            <Image
                              key={i}
                              src={image}
                              alt={`Day ${index + 1} activity ${i + 1}`}
                              width={80}
                              height={80}
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </section>

            {/* Inclusions Section */}
            <section ref={sectionRefs.inclusion} className="mb-5">
              <h2 className="fw-bold mb-4">What&apos;s Included</h2>
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-success fw-semibold mb-3">✓ Included</h5>
                  <ul className="list-unstyled">
                    {pkg.inclusions.map((item: string, index: number) => (
                      <li key={index} className="mb-2 d-flex align-items-start">
                        <span className="text-success me-2 mt-1">✓</span>
                        <span className="text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="text-danger fw-semibold mb-3">✗ Not Included</h5>
                  <ul className="list-unstyled">
                    {pkg.exclusions.map((item: string, index: number) => (
                      <li key={index} className="mb-2 d-flex align-items-start">
                        <span className="text-danger me-2 mt-1">✗</span>
                        <span className="text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Policies Section */}
            <section ref={sectionRefs.policy} className="mb-5">
              <h2 className="fw-bold mb-4">Terms & Policies</h2>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <ul className="list-unstyled mb-0">
                    {pkg.policies.map((policy: string, index: number) => (
                      <li key={index} className="mb-3 d-flex align-items-start">
                        <span className="text-primary me-2 mt-1">•</span>
                        <span className="text-muted">{policy}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top d-none d-lg-block" style={{ top: '140px' }}>
              {/* Price Card */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="text-center mb-3">
                    <h3 className="fw-bold mb-2">{pkg.title}</h3>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <Badge 
                        bg="primary" 
                        className="me-3 px-3 py-2" 
                        style={{ fontSize: '14px', backgroundColor: '#007bff' }}
                      >
                        {pkg.duration}
                      </Badge>
                      <div className="d-flex align-items-center">
                        <span className="text-warning me-1" style={{ fontSize: '16px' }}>★</span>
                        <span className="fw-semibold">{pkg.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <span className="text-muted text-decoration-line-through me-2 h6">
                        ₹{pkg.originalPrice.toLocaleString()}
                      </span>
                      <span className="h4 fw-bold mb-0" style={{ color: '#28a745' }}>
                        ₹{pkg.discountedPrice.toLocaleString()}
                      </span>
                    </div>
                    <small className="text-muted">per person</small>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="success" 
                      size="lg"
                      className="fw-semibold py-3"
                      style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="lg"
                      className="fw-semibold py-3"
                    >
                      Enquire Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Contact Card */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    <span 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#ffc107',
                        color: 'black'
                      }}
                    >
                      📞
                    </span>
                  </div>
                  <h6 className="fw-bold mb-2">Call us at +91 9867356174</h6>
                  <p className="text-muted small mb-3">
                    Want a customized package? <span style={{ color: '#28a745', cursor: 'pointer' }}>Click Here</span>
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="row mt-5">
          <div className="col-12">
            <Card className="bg-primary text-white">
              <Card.Body className="text-center py-4">
                <h3 className="fw-bold mb-3">Ready to Book Your Dream Trip?</h3>
                <p className="mb-4">
                  Join thousands of happy travelers who have experienced the best with BuzzPlanners.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button variant="light" size="lg" className="px-4">
                    Book Now - ₹{pkg.discountedPrice.toLocaleString()}
                  </Button>
                  <Button variant="outline-light" size="lg" className="px-4">
                    Customize Package
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <div className="p-4 bg-light rounded">
              Want a customized package?{' '}
              <span style={{ color: '#22b06b', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
                Click Here
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />

      {/* Custom Styles */}
      <style jsx global>{`
        .travel-carousel .carousel-control-prev,
        .travel-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }

        .travel-carousel .carousel-control-prev {
          left: 20px;
        }

        .travel-carousel .carousel-control-next {
          right: 20px;
        }

        .travel-carousel .carousel-control-prev-icon,
        .travel-carousel .carousel-control-next-icon {
          width: 20px;
          height: 20px;
        }

        .breadcrumb {
          background: none;
          padding: 0;
          margin: 0;
        }

        .breadcrumb-item a {
          color: #007bff;
          text-decoration: none;
        }

        .breadcrumb-item a:hover {
          text-decoration: underline;
        }

        .breadcrumb-item.active {
          color: #6c757d;
        }

        .breadcrumb-item + .breadcrumb-item::before {
          content: "›";
          color: #6c757d;
        }

        @media (max-width: 991px) {
          .travel-carousel .carousel-control-prev,
          .travel-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
          }

          .travel-carousel .carousel-control-prev {
            left: 10px;
          }

          .travel-carousel .carousel-control-next {
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
}
