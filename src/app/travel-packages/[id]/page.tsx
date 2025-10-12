/* eslint-disable @typescript-eslint/no-unused-vars  */
/* eslint-disable @next/next/no-img-element  */

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
      day: 'Day 3: Shopping & Return to Delhi',
      details: [
        'Morning: Breakfast & check-out',
        'Visit Chatuchak/Platinum Mall/MBK Center for last-minute shopping',
        'Afternoon: Airport transfer & flight back to Delhi',
        'Night: Arrive in Delhi'
      ],
      images: ['/images/stay3.jpg', '/images/stay4.jpg']
    }
  ],
  inclusions: [
    'Flight tickets',
    'Meals',
    'Accommodation',
    'Beverages',
    'Sightseeing'
  ],
  exclusions: [
    'Local Transportation',
    'Outside Food'
  ],
  policy: [
    'Valid ID Proof Required: All travelers must carry original government-issued ID (Aadhar, Passport, etc.) during the trip.',
    'No Alcohol or Drugs: Consumption of alcohol or any illegal substances during group tours is strictly prohibited.',
    'Punctuality: Kindly adhere to the given schedule. Delays may affect the itinerary and are not the responsibility of the organizers.'
  ]
};

const tabKeys = [
  { key: "overview", label: "Overview" },
  { key: "itinerary", label: "Itinerary" },
  { key: "inclusion", label: "Inclusion / Exclusion" },
  { key: "policy", label: "Policy" }
];

export default function TravelPackageDetailsPage() {

  // Replace this with real data fetching
  const [pkg, setPkg] = useState<any>(null);

  const [activeTab, setActiveTab] = useState('overview');

  type SectionKey = 'overview' | 'itinerary' | 'inclusion' | 'policy';


  const overviewRef = useRef<HTMLDivElement | null>(null);
  const itineraryRef = useRef<HTMLDivElement | null>(null);
  const inclusionRef = useRef<HTMLDivElement | null>(null);
  const policyRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<SectionKey, React.RefObject<HTMLDivElement | null>> = {
    overview: overviewRef,
    itinerary: itineraryRef,
    inclusion: inclusionRef,
    policy: policyRef
  };

  const stickyTabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPkg(dummyPackageDetails);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 120; // adjust offset for sticky
      const scrollPosition = window.scrollY + threshold + 1;
      const sectionKeys: SectionKey[] = ['overview', 'itinerary', 'inclusion', 'policy'];

      const offsets = sectionKeys.map((key) => ({
        key,
        offset: sectionRefs[key].current
          ? sectionRefs[key].current!.getBoundingClientRect().top + window.scrollY
          : 0
      }));
      // The last section above threshold
      const current = offsets
        .filter(s => scrollPosition >= s.offset)
        .sort((a, b) => b.offset - a.offset)[0];

      if (current && current.key !== activeTab) {
        setActiveTab(current.key);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [activeTab]);

  const handleTabClick = (key: SectionKey) => {
    setActiveTab(key);
    const topOffset = stickyTabsRef.current ? stickyTabsRef.current.offsetHeight + 10 : 0;
    const section = sectionRefs[key]?.current;
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
    }
  };

  if (!pkg) return <div>Loading...</div>;

  return (
    <div className="bg-app">
      <Header />
      <div className="container my-5" style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
        {/* Breadcrumb */}
        <div className="mb-2 text-success" style={{ fontWeight: 500, fontSize: 15 }}>
          Home &gt; Holidays &gt; Thailand
        </div>
        {/* Title and tags */}
        <h2
          className="mb-2"
          style={{ fontWeight: 700, fontSize: 28, color: '#212529' }}
        >
          {pkg.title}
        </h2>
        <div className="d-flex align-items-center mb-3 gap-3">
          <div className="d-flex align-items-center mb-3 gap-3">
            <span style={{
              fontSize: 16,
              padding: "8px 14px",
              borderRadius: 8,
              backgroundColor: "#E3F1EA",
              color: "black",
              fontWeight: 600,
              display: "inline-block"
            }}>
              {pkg.duration}
            </span>
            <span style={{
              fontSize: 16,
              padding: "8px 14px",
              borderRadius: 8,
              backgroundColor: "#FFFAE1",
              color: "black",
              fontWeight: 600,
              display: "inline-block"
            }}>
              ★ {pkg.rating} Star
            </span>
          </div>

        </div>
        {/* Images carousel */}
        <Carousel className="mb-4" style={{ borderRadius: 12, overflow: 'hidden' }}>
          {pkg.images.map((img: string | Blob | undefined, i: React.Key | null | undefined) => (
            <Carousel.Item key={i}>
              <img src={img} alt="Package" className="d-block w-100" style={{ maxHeight: '30rem', objectFit: 'cover' }} />
            </Carousel.Item>
          ))}
        </Carousel>



        <div className="row">
          {/* Left: Card for content */}
          <div className="col-lg-8 mb-4">
            {/* Sticky Tabs */}
            <div
              ref={stickyTabsRef}
              className="d-flex mb-4"
              style={{
                background: '#fff',
                top: 0,
                left: 0,
                zIndex: 100,
                position: 'sticky',
                padding: '16px 0 12px 0',
              }}
            >
              {tabKeys.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                  style={{
                    border: 'none',
                    background: activeTab === tab.key ? '#EEFEF6' : '#F2F2F280',
                    color: activeTab === tab.key ? 'black' : '#555555',
                    borderRadius: 25,
                    fontWeight: 600,
                    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
                    padding: '8px 18px',
                    marginRight: 12,
                    cursor: 'pointer',
                    fontSize: 20,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleTabClick(tab.key as SectionKey)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className='p-2'>
              {/* Overview Section */}
              <section ref={overviewRef} id="overview-section">
                <p
                  style={{
                    color: '#222222',
                    fontSize: 18,
                    marginTop: 13,
                    marginBottom: 30,
                    lineHeight: 1.64,
                  }}
                  className='text-justify fw-medium'
                >
                  {pkg.overview}
                </p>
              </section>
              {/* Itinerary Section */}
              <section ref={itineraryRef} id="itinerary-section" className='mt-5'>
                <h5
                  style={{
                    fontWeight: 700,
                    fontSize: 25,
                    color: '#212529',
                  }}
                  className='my-5'
                >
                  Detailed Itinerary
                </h5>
                <Card style={{ borderLeft: '3px solid #E6E6E6', borderRight: '0px', borderTop: '0px', borderBottom: '0px', borderRadius: 0 }}>
                  {pkg.itinerary.map((day: { day: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; details: string[]; images: string[]; }, i: React.Key | null | undefined) => (
                    <div
                      key={i}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: 'black',
                          fontSize: 18,
                          marginBottom: 7,
                          backgroundColor: '#CDE0E980',
                          padding: '1%',
                          borderRadius: '0px 10px 10px 0px',
                          paddingLeft: '2%'
                        }}
                      >
                        {day.day}
                      </div>
                      {day.details.map((det: string, d: number) => (
                        <div
                          key={d}
                          style={{ color: '#222222', fontSize: 17, lineHeight: 1.8, marginLeft: '2%' }}
                        >
                          {det}
                        </div>
                      ))}
                      <div className="d-flex gap-2 my-4" style={{ marginLeft: '2%', marginBottom: '2%' }}>
                        {day.images &&
                          day.images.map((img: string, j: number) => (
                            <img
                              key={j}
                              src={img}
                              alt="Itinerary"
                              style={{
                                width: 94,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 10,
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </Card>
              </section>
              {/* Inclusion Section */}
              <section ref={inclusionRef} id="inclusion-section" style={{ marginTop: 32 }}>
                <div style={{ display: "flex", gap: 64, alignItems: "flex-start", justifyContent: "flex-start" }}>
                  {/* Inclusions Column */}
                  <div>
                    <h5
                      style={{
                        fontWeight: 700,
                        fontSize: 25,
                        color: '#212529',
                      }}
                      className='my-5'
                    >
                      Inclusions
                    </h5>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {pkg.inclusions.map((inc: string, i: number) => (
                        <li key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 18,
                          fontWeight: 500,
                          marginBottom: 18,
                          color: "#222"
                        }}>
                          {/* Green check icon with pale bg */}
                          <span style={{
                            width: 34,
                            height: 34,
                            background: "#d5f5e3",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 15
                          }}>
                            <svg width="25" height="25" viewBox="0 0 19 19" fill="none">
                              <circle cx="9.5" cy="9.5" r="9.5" fill="none" />
                              <path d="M5.5 10.5L8.25 13.25L14 7.5" stroke="#28b66b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Exclusions Column */}
                  <div>
                    <h5
                      style={{
                        fontWeight: 700,
                        fontSize: 25,
                        color: '#212529',
                      }}
                      className='my-5'
                    >
                      Exclusion
                    </h5>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {pkg.exclusions.map((exc: string, i: number) => (
                        <li key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 18,
                          fontWeight: 500,
                          marginBottom: 18,
                          color: "#222"
                        }}>
                          {/* Red cross icon with pale bg */}
                          <span style={{
                            width: 34,
                            height: 34,
                            background: "#ffe0e0",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 15
                          }}>
                            <svg width="25" height="25" viewBox="0 0 19 19" fill="none">
                              <circle cx="9.5" cy="9.5" r="9.5" fill="none" />
                              <path d="M6.5 6.5L12.5 12.5" stroke="#ff5c5c" strokeWidth="1.2" strokeLinecap="round" />
                              <path d="M12.5 6.5L6.5 12.5" stroke="#ff5c5c" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                          </span>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Policy Section */}
              <section ref={policyRef} id="policy-section" style={{ marginTop: 32 }}>
                <h5
                  style={{
                    fontWeight: 700,
                    fontSize: 25,
                    color: '#212529',
                  }}
                  className='my-5'
                >
                  Policy
                </h5>
                <ol>
                  {pkg.policy.map((rule: string, i: number) => (
                    <li key={i} style={{ color: 'rgb(34, 34, 34)', fontSize: 17.5 }} className='my-3'>
                      {rule}
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
          {/* Right column: Price and Actions card */}
          <div className="col-lg-4">
            <div
              className="card"
              style={{
                borderRadius: '16px 16px 0px 0px',
                border: '1.5px solid #e1ece5',
                boxShadow: '0 6px 32px 0 rgba(108, 190, 134, 0.08)',
                padding: '32px 34px 26px 34px',
                minWidth: 300,
                maxWidth: 350,
                background: '#fff',
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#222',
                  marginBottom: 4,
                  letterSpacing: 0.1,
                  textAlign: 'center'
                }}>
                  Starts From
                </div>
                <div style={{ fontSize: 25, color: '#f55', fontWeight: 700, textDecoration: 'line-through', marginBottom: 0, textAlign: 'center' }}>
                  ₹{pkg.originalPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#111', margin: '8px 0 2px 0', lineHeight: 1.1, textAlign: 'center' }}>
                  ₹{pkg.discountedPrice.toLocaleString()}
                </div>
                <div style={{ fontSize: 15, color: 'black', marginBottom: 6, textAlign: 'center' }}>
                  Price Per Person
                </div>
              </div>
              <button
                className="w-100"
                style={{
                  background: '#24a86b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  padding: '16px 0',
                  borderRadius: 30,
                  border: 'none',
                  marginBottom: 14,
                  letterSpacing: 0.3,
                  boxShadow: '0 2px 12px rgba(22,139,63,.09)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                BOOK NOW
              </button>
              <button
                className="w-100"
                style={{
                  background: '#fff',
                  color: '#24a86b',
                  fontWeight: 700,
                  fontSize: 20,
                  padding: '16px 0',
                  borderRadius: 30,
                  border: '2.2px solid #24a86b',
                  marginBottom: 22,
                  letterSpacing: 0.3,
                  cursor: 'pointer',
                }}
              >
                SEND ENQUIRY
              </button>
              

            </div>
            {/* Yellow call bar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "#FBD473",
                borderRadius: '0px 0px 10px 10px',
                padding: "13px 10px",
                marginBottom: 0,
                fontWeight: 600,
                color: "#121212",
                fontSize: 16,
                minWidth: 300,
                maxWidth: 350,
                justifyContent: 'center',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 9 }}>
                  <Image
                                    src={'/icons/customer-support.png'}
                                    alt='Stay Icon'
                                    width={30}
                                    height={30}
                                  />
                  
                </span>
                
                <span style={{ fontWeight: 600, color: "#111", fontSize: 16 }}>
                  Call us at +91 9667356174
                </span>
              </div>
            <div className='fs-5 mt-2'>
            Want a customized package?{' '}
            <span style={{ color: '#22b06b', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
              Click Here
            </span>
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
