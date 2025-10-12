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
      <section className="bg-light px-2 px-md-5">
        <Container>
          <Row className="mb-4 mt-5">
            <Col>
              <h2 className="fw-bold text-center">Exclusive Deals</h2>
            </Col>
          </Row>

          <Row className="align-items-stretch">
            {/* Left Image Column: render only on non-mobile */}
            {!isMobile && (
              <Col md={4} className="p-0 mb-4 mb-md-0 traveller-col">
                <div className="traveller-wrap">
                  <Image
                    src={travellerImg}
                    alt="Traveller"
                    fill
                    className="exclusive-hero-img"
                    sizes="(min-width: 992px) 33vw, 100vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </Col>
            )}

            <Col md={isMobile ? 12 : 8}>
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
        /* make traveller image fill the left column on desktop and avoid left-side cropping */
        .traveller-col { padding: 0; overflow: visible; }
        .traveller-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 340px; /* increase so image has room - adjust to match right column */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        /* Next/Image with renders an absolutely positioned img — override with :global */
        :global(.exclusive-hero-img) {
          object-fit: cover !important;
          object-position: left center !important; /* align visible crop to left so image isn't cut */
          width: 100% !important;
          height: 100% !important;
          border-radius: 12px;
          top: 0;
          left: 0;
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

        .exclusive-hero-img { display: block; margin: 0 auto; max-width: 420px; height: auto; }
        @media (max-width: 600px) {
          /* hero removed via conditional render; keep safety */
          .exclusive-hero-img { display: none; }
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
