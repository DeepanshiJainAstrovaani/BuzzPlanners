'use client';

import React, { useEffect, useState } from 'react';
// If you have an API for fetching details by id, import here
// import { fetchTravelPackageById } from '@/api/getTravelPackages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const dummyPackageDetails = {
  id: '1',
  title: 'Thailand Group Party 3 Days Trip',
  duration: '3 Days 2 Night',
  rating: 4.5,
  originalPrice: 35500,
  discountedPrice: 25500,
  images: [
    'IMAGE_URL_1',
    'IMAGE_URL_2',
    'IMAGE_URL_3'
  ],
  overview: `Embark on an unforgettable 3 Days 2 Nights Thailand getaway starting and ending in Delhi. ...`,
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
      images: ['IMAGE_URL_1']
    },
    {
      day: 'Day 2: Coral Island Tour & Pattaya Exploration',
      details: [
        'Morning: Coral Island tour and water sports',
        'Evening: Return to Bangkok, explore nightlife',
        'Night: Return to hotel, overnight stay'
      ],
      images: ['IMAGE_URL_2']
    },
    {
      day: 'Day 3: Shopping & Return to Delhi',
      details: [
        'Morning: Breakfast & check-out',
        'Visit Chatuchak/Platinum Mall/MBK Center for last-minute shopping',
        'Afternoon: Airport transfer & flight back to Delhi',
        'Night: Arrive in Delhi'
      ],
      images: ['IMAGE_URL_3']
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

export default function TravelPackageDetailsPage({ params }: { params: { id: string } }) {
  // Replace this with real data fetching
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    // Here you would fetch by params.id
    // Example: fetchTravelPackageById(params.id).then(setPkg);
    setPkg(dummyPackageDetails);
  }, [params.id]);

  if (!pkg) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <div className="container my-4">
        {/* Breadcrumb */}
        <div className="mb-2" style={{ color: "#4C8D57" }}>
          Home &gt; Holidays &gt; Thailand
        </div>
        {/* Title and tags */}
        <h2>{pkg.title}</h2>
        <div className="d-flex align-items-center gap-3 mb-3">
          <span style={{
            background: "#edfbea",
            color: "#1abd5c",
            padding: "2px 12px",
            borderRadius: "8px",
            fontWeight: 600
          }}>
            {pkg.duration}
          </span>
          <span style={{
            background: "#fff7eb",
            color: "#ffb200",
            padding: "2px 12px",
            borderRadius: "8px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center"
          }}>
            ★ {pkg.rating} Star
          </span>
        </div>
        {/* Images carousel */}
        <div className="d-flex overflow-auto gap-3 mb-4">
          {pkg.images.map((img: string, i: number) => (
            <img key={i} src={img} alt="Package" style={{ height: 250, borderRadius: 12 }} />
          ))}
        </div>
        <div className="row">
          {/* Left: Details Section */}
          <div className="col-lg-8">
            {/* Tabs */}
            <div className="d-flex gap-3 mb-3">
              <button className="btn btn-outline-success active">Overview</button>
              <button className="btn btn-outline-success">Itinerary</button>
              <button className="btn btn-outline-success">Inclusion / Exclusion</button>
              <button className="btn btn-outline-success">Policy</button>
            </div>
            {/* Simple logic for tabs, can extend with useState */}
            <div>
              <h5>Overview</h5>
              <p>{pkg.overview}</p>
              <h5>Detailed Itinerary</h5>
              {pkg.itinerary.map((day: any, i: number) => (
                <div key={i} className="mb-4">
                  <div style={{ fontWeight: 600, background: "#e8f2ee", padding: '6px 12px', borderRadius: 8 }}>
                    {day.day}
                  </div>
                  <ul className="mt-2">
                    {day.details.map((det: string, d: number) => (
                      <li key={d}>{det}</li>
                    ))}
                  </ul>
                  <div className="d-flex gap-2 mt-1">
                    {day.images.map((img: string, j: number) => (
                      <img key={j} src={img} style={{ width: 80, borderRadius: 10 }} alt="itinerary" />
                    ))}
                  </div>
                </div>
              ))}
              <h5>Inclusions</h5>
              <ul>
                {pkg.inclusions.map((inc: string, i: number) => (
                  <li key={i} style={{ color: "#1abd5c", fontWeight: 500 }}>{inc}</li>
                ))}
              </ul>
              <h5>Exclusions</h5>
              <ul>
                {pkg.exclusions.map((exc: string, i: number) => (
                  <li key={i} style={{ color: "#ff5252", fontWeight: 500 }}>{exc}</li>
                ))}
              </ul>
              <h5>Policy</h5>
              <ol>
                {pkg.policy.map((rule: string, i: number) => (
                  <li key={i}>{rule}</li>
                ))}
              </ol>
            </div>
          </div>
          {/* Right: Price and Actions */}
          <div className="col-lg-4">
            <div className="p-4 shadow rounded mb-3" style={{ background: "#fff" }}>
              <div>
                <span style={{ textDecoration: "line-through", color: "#beafaf" }}>₹{pkg.originalPrice}</span>
                <span style={{ marginLeft: 8, fontSize: 24, fontWeight: 700, color: "#1abd5c" }}>
                  ₹{pkg.discountedPrice}
                </span>
                <div>Price Per Person</div>
              </div>
              <button className="btn btn-success btn-block my-3" style={{ width: "100%" }}>BOOK NOW</button>
              <button className="btn btn-outline-success btn-block" style={{ width: "100%" }}>SEND ENQUIRY</button>
              <div className="mt-3 px-2 py-3 rounded" style={{ background: "#ffeebc" }}>
                <div style={{ fontWeight: 600 }}>Call us at +91 9667356174</div>
                <div style={{ fontSize: 14 }}>Want a customized package? <span style={{ color: "#1abd5c", cursor: "pointer" }}>Click Here</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
