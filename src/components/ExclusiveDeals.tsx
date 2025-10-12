/* eslint-disable @next/next/no-img-element  */

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import travellerImg from '../../public/images/traveller.png';
import { useExperience, type Experience } from '@/context/ExperienceContext';

const tabOptions: Experience[] = ['flights', 'events', 'hotels', 'trips', 'holiday'];

function getDealsFor(exp: Experience) {
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

  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const id = setInterval(() => {
      setMobileIndex((i) => (i + 1) % deals.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isMobile, deals.length]);

  return (
    <>
      <section className="px-2 px-md-5">
        <Container>
          <Row className="mb-4 mt-5">
            <Col>
              <h2 className="fw-bold text-center">Exclusive Deals</h2>
            </Col>
          </Row>

          <Row className="align-items-stretch">
            {/* Left Image Column: show on desktop */}
            <Col md={4} className="mb-4 mb-md-0 traveller-col d-none d-md-block">
              <div className="traveller-wrap">
                <Image
                  src={travellerImg}
                  alt="Traveller"
                  className="exclusive-hero-img"
                  fill
                  priority
                />
              </div>
            </Col>

            <Col xs={12} md={8} className="deals-content-col">
              {/* Tabs: single-line horizontally scrollable */}
              <div className="exclusive-tabs mb-4">
                {tabOptions.map((tab) => (
                  <Button
                    key={tab}
                    variant={active === tab ? 'success' : 'light'}
                    className={`exclusive-category rounded-pill px-4 py-1 fw-medium text-capitalize ${active === tab ? 'custom-active-btn' : 'text-muted'}`}
                    onClick={() => setActive(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Desktop: two-up grid */}
              <Row className="mb-4 g-4 d-none d-md-flex">
                <Col md={6}>
                  <div className="deal-image-container">
                    <Image src={deals[0].src} alt={deals[0].alt} className="img-fluid rounded-4 deal-image" width={500} height={300} style={{ borderRadius: '12px', width: '100%', height: '200px', objectFit: 'cover' }} />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="deal-image-container">
                    <Image src={deals[1].src} alt={deals[1].alt} className="img-fluid rounded-4 deal-image" width={500} height={300} style={{ borderRadius: '12px', width: '100%', height: '200px', objectFit: 'cover' }} />
                  </div>
                </Col>
              </Row>

              {/* Mobile: single-image autoplay slider (full width) */}
              <div className="deals-slider-mobile mb-3 d-block d-md-none">
                <img src={deals[mobileIndex].src} alt={deals[mobileIndex].alt} className="w-100 rounded-4" style={{ height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              </div>

              <div>
                <Button variant="success" className="px-5 py-2 mb-4 fw-bold rounded-pill" style={{ backgroundColor: 'rgb(20, 161, 95)', borderColor: 'rgb(20, 161, 95)' }}>
                  See offers
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        /* make traveller image fill the left column on desktop */
        .traveller-col { 
          padding: 0;
          padding-right: 15px;
        }
        .traveller-wrap {
          width: 100%;
          height: 100%;
          min-height: 320px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        /* Style the traveller image */
        :global(.exclusive-hero-img) {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center left !important;
          border-radius: 12px !important;
        }

        .exclusive-tabs {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.25rem;
          white-space: nowrap;

          /* hide horizontal scrollbar while keeping scroll behavior */
          -ms-overflow-style: none; /* IE/Edge */
          scrollbar-width: none; /* Firefox */
        }
        .exclusive-tabs::-webkit-scrollbar { display: none; } /* Safari/Chrome */

        .exclusive-category { flex: 0 0 auto; white-space: nowrap; }

        .deals-content-col {
          display: flex;
          flex-direction: column;
          min-height: 320px;
        }

        @media (max-width: 600px) {
          /* hero removed via conditional render for mobile */
          .traveller-col { display: none; }
          .deals-content-col {
            min-height: auto;
          }
        }

        .deals-slider-mobile img { width: 100%; height: 200px; object-fit: cover; object-position: center; border-radius: 12px; display: block; }

        :global(.custom-active-btn) {
          background-color: #c2e9d7 !important;
          color: rgb(20, 124, 43) !important;
          border-color: #c2e9d7 !important;
        }

        .deal-image-container { width: 100%; height: 200px; overflow: hidden; border-radius: 12px; }
        :global(.deal-image) { width: 100% !important; height: 200px !important; object-fit: cover !important; border-radius: 12px !important; }
      `}</style>
    </>
  );
}
