/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';

export default function TravelPackageCard({ pkg }: { pkg: any }) {
  // Use first image as main, next two as thumbnails (fallbacks if missing)
  const mainImage = '/images/stay1.png';
  const thumb1 = '/images/stay2.jpg';
  const thumb2 = '/images/stay3.jpg';
  const router = useRouter();

  return (
    <div
      className="card mb-3 border-0 shadow-sm"
      style={{
        borderRadius: '1rem',
        padding: '24px 24px 24px 24px',
        display: 'flex',
        alignItems: 'center',
        background: '#fff'
      }}
    >
      <div className="d-flex w-100 align-items-center">
        {/* Left: Large image and small thumbs */}
        <div style={{ minWidth: '20rem', marginRight: 28, position: 'relative' }}>
          {/* Main image */}
          <div style={{ position: 'relative' }}>
            <img
              src={mainImage}
              alt="Main"
              style={{
                width: 260,
                height: 140,               // fixed height
                borderRadius: '1rem',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                background: '#eee'
              }}
            />
            {/* Overlapping Star Badge */}
            <span
              className="badge"
              style={{
                backgroundColor: '#F6EFCE',
                color: '#866308',
                position: 'absolute',
                left: 0,
                fontWeight: 500,
                fontSize: '1rem',
                padding: '6px 14px',
                borderRadius: '1rem 0rem 1rem 0rem',
                boxShadow: '0 0 4px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '1.1rem' }} aria-label="Star" role="img">⭐</span>
              {pkg.star} Star
            </span>
          </div>
          {/* Thumbnails */}
          <div className="d-flex mt-2" style={{ gap: 16 }}>
            <img
              src={thumb1}
              alt="thumb1"
              style={{
                width: 120,
                height: 90,                // fixed height
                borderRadius: 8,
                objectFit: 'cover',
                background: '#eee'
              }}
            />
            <img
              src={thumb2}
              alt="thumb2"
              style={{
                width: 120,
                height: 90,                // fixed height
                borderRadius: 8,
                objectFit: 'cover',
                background: '#eee'
              }}
            />
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="fw-bold fs-3">{pkg.title}</div>
          <div className="fs-5 mb-2 text-muted">Delhi to Delhi</div>
          <div className="d-flex align-items-center gap-3 mb-2">
            {pkg.flights && (
              <div>
                <span className="me-1" title="Flights"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    padding: '20%',
                    width: '4rem',
                    height: '4rem',
                    display: 'block'
                  }}
                >
                  <Image
                    src={'/icons/airplane.png'}
                    alt='Flights Icon'
                    width={40}
                    height={40}
                  />

                </span>
                <span className="mt-2 text-center fs-7 w-100 d-block text-muted">Flights</span>
              </div>
            )}
            {pkg.stay && (
              <div>
                <span className="me-1" title="Stay"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    padding: '20%',
                    width: '4rem',
                    height: '4rem',
                    display: 'block'
                  }}
                >
                  <Image
                    src={'/icons/stay.png'}
                    alt='Stay Icon'
                    width={40}
                    height={40}
                  />
                </span>
                <span className="mt-2 text-center fs-7 w-100 d-block text-muted">Stay</span>
              </div>
            )}
            {pkg.meals && (
              <div>
                <span className="me-1" title="Meals"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    padding: '20%',
                    width: '4rem',
                    height: '4rem',
                    display: 'block'
                  }}
                >
                  <Image
                    src={'/icons/dinner.png'}
                    alt='Meals Icon'
                    width={40}
                    height={40}
                  />
                </span>
                <span className="mt-2 text-center fs-7 w-100 d-block text-muted">Meals</span>
              </div>
            )}
            {pkg.sightseeing && (
              <div>
                <span title="Sightseeing"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    padding: '20%',
                    width: '4rem',
                    height: '4rem',
                    display: 'block'
                  }}
                >
                  <Image
                    src={'/icons/binoculars.png'}
                    alt='Stay Icon'
                    width={40}
                    height={40}
                  />
                </span>
                <span className="mt-2 text-center fs-7 w-100 d-block text-muted">Sightseeing</span>
              </div>
            )}
            
          </div>
          <span className="text-success">
              +6 more amenities
            </span>
          <div className="fs-4 mt-3" style={{ color: '#FF5F5F' }}>
            {pkg.seatsLeft === 'few' && 'Only few seats left'}
          </div>
        </div>

        {/* Right: Price & CTAs */}
        <div className="d-flex flex-column align-items-center pb-5" style={{ minWidth: 200, backgroundColor: '#EEFEF6' }}>
          {pkg.specialOffer && (
            <span
              className="badge mb-2"
              style={{
                background: '#ffe9c7',
                color: '#b05a00',
                fontWeight: 600,
                borderRadius: 7,
                fontSize: 14,
                padding: '6px 14px'
              }}
            >
              Special Offer
            </span>
          )}
          <div className="fw-bold text-success fs-2 mb-1" style={{ fontSize: 34 }}>
            ₹{pkg.price.toLocaleString('en-IN')}
          </div>
          <div className="text-muted fw-semibold">Price Per Person</div>
          <div className="d-flex flex-column gap-2 mt-3" style={{ width: 150 }}>
            <Button
              className="btn btn-success fw-bold text-white mb-1"
              style={{ borderRadius: 22, fontSize: 16 }}
              onClick={() => {
                console.log('button clicked');
                console.log('Navigating to package:', pkg.id);
                router.push(`/travel-packages/${pkg.id}`);
                }}
            >
              BOOK NOW
            </Button>
            <button
              className="btn btn-outline-success fw-semibold"
              style={{
                borderRadius: 22,
                fontSize: 16,
                borderWidth: 2
              }}
            >
              SEND ENQUIRY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
