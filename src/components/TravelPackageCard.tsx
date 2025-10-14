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
        borderRadius: 'clamp(8px, 2vw, 16px)',
        padding: 'clamp(12px, 3vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        background: '#fff'
      }}
    >
      <div className="d-flex w-100 align-items-center">
        {/* Left: Large image and small thumbs */}
        <div style={{ position: 'relative' }}>
          {/* Main image */}
          <div style={{ position: 'relative' }}>
            <img
              src={mainImage}
              alt="Main"
              style={{
                width: 'clamp(180px, 22vw, 202px)',
                height: 'clamp(100px, 12vw, 120px)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
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
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(8px, 2vw, 12px) 0 clamp(8px, 2vw, 12px) 0',
                boxShadow: '0 0 4px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                top: 0
              }}
            >
              <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }} aria-label="Star" role="img">⭐</span>
              {pkg.star} Star
            </span>
          </div>
          {/* Thumbnails */}
          <div className="d-flex mt-2" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
            <img
              src={thumb1}
              alt="thumb1"
              style={{
                width: 'clamp(80px, 10vw, 95px)',
                height: 'clamp(60px, 8vw, 75px)',
                borderRadius: 'clamp(4px, 1vw, 6px)',
                objectFit: 'cover',
                background: '#eee'
              }}
            />
            <img
              src={thumb2}
              alt="thumb2"
              style={{
                width: 'clamp(80px, 10vw, 95px)',
                height: 'clamp(60px, 8vw, 75px)',
                borderRadius: 'clamp(4px, 1vw, 6px)',
                objectFit: 'cover',
                background: '#eee'
              }}
            />
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex-grow-1" style={{ padding: '0 clamp(8px, 2vw, 16px)' }}>
          <div className="fw-bold" style={{ fontSize: 'clamp(16px, 3.5vw, 20px)' }}>{pkg.title}</div>
          <div className="mb-2 text-muted" style={{ fontSize: 'clamp(13px, 2.5vw, 15px)' }}>Delhi to Delhi</div>
          <div className="d-flex align-items-center gap-3 mb-2">
            {pkg.flights && (
              <div>
                <span className="me-1" title="Flights"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    width: 'clamp(2.5rem, 6vw, 3.5rem)',
                    height: 'clamp(2.5rem, 6vw, 3.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={'/icons/airplane.png'}
                    alt='Flights Icon'
                    width={20}
                    height={20}
                  />
                </span>
                <span className="mt-2 text-center w-100 d-block text-muted" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}>Flights</span>
              </div>
            )}
            {pkg.stay && (
              <div>
                <span className="me-1" title="Stay"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    width: 'clamp(2.5rem, 6vw, 3.5rem)',
                    height: 'clamp(2.5rem, 6vw, 3.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={'/icons/stay.png'}
                    alt='Stay Icon'
                    width={20}
                    height={20}
                  />
                </span>
                <span className="mt-2 text-center w-100 d-block text-muted" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}>Stay</span>
              </div>
            )}
            {pkg.meals && (
              <div>
                <span className="me-1" title="Meals"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    width: 'clamp(2.5rem, 6vw, 3.5rem)',
                    height: 'clamp(2.5rem, 6vw, 3.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={'/icons/dinner.png'}
                    alt='Meals Icon'
                    width={20}
                    height={20}
                  />
                </span>
                <span className="mt-2 text-center w-100 d-block text-muted" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}>Meals</span>
              </div>
            )}
            {pkg.sightseeing && (
              <div>
                <span title="Sightseeing"
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '100%',
                    width: 'clamp(2.5rem, 6vw, 3.5rem)',
                    height: 'clamp(2.5rem, 6vw, 3.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={'/icons/binoculars.png'}
                    alt='Sightseeing Icon'
                    width={20}
                    height={20}
                  />
                </span>
                <span className="mt-2 text-center w-100 d-block text-muted" style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}>Sightseeing</span>
              </div>
            )}
            
          </div>
          <span className="text-success" style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
              +6 more amenities
            </span>
          <div className="mt-3" style={{ color: '#FF5F5F', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
            {pkg.seatsLeft === 'few' && 'Only few seats left'}
          </div>
        </div>

        {/* Right: Price & CTAs */}
        <div className="d-flex flex-column align-items-center" style={{ 
          backgroundColor: '#EEFEF6',
          padding: 'clamp(12px, 3vw, 20px)',
          borderRadius: 'clamp(8px, 2vw, 12px)'
        }}>
          {pkg.specialOffer && (
            <span
              className="badge mb-2"
              style={{
                background: '#ffe9c7',
                color: '#b05a00',
                fontWeight: 600,
                borderRadius: 'clamp(4px, 1vw, 6px)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)'
              }}
            >
              Special Offer
            </span>
          )}
          <div className="fw-bold text-success mb-1" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>
            ₹{pkg.price.toLocaleString('en-IN')}
          </div>
          <div className="text-muted fw-semibold" style={{ fontSize: 'clamp(11px, 2vw, 13px)' }}>Price Per Person</div>
          <div className="d-flex flex-column gap-2 mt-3" style={{ width: '100%' }}>
            <Button
              className="btn btn-success fw-bold text-white mb-1"
              style={{ 
                borderRadius: 'clamp(16px, 4vw, 22px)', 
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)'
              }}
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
                borderRadius: 'clamp(16px, 4vw, 22px)',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                borderWidth: 2,
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)'
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
