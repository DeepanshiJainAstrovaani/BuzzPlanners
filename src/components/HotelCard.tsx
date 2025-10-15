/* eslint-disable @next/next/no-img-element */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HotelCard({ hotel }: { hotel: any }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/hotels/${hotel.id}`);
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: '12px',
        padding: '20px',
        background: '#fff',
        marginBottom: '16px'
      }}
    >
      <div className="d-flex align-items-center gap-4">
        {/* Hotel Image */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            style={{
              width: '240px',
              height: '160px',
              borderRadius: '8px',
              objectFit: 'cover',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          {/* Star Rating Badge */}
          <div
            className="badge position-absolute"
            style={{
              top: '8px',
              left: '8px',
              backgroundColor: '#FFF3CD',
              color: '#856404',
              fontWeight: 600,
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            ⭐ {hotel.star} Star
          </div>
        </div>

        {/* Hotel Details */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 className="mb-1" style={{ fontWeight: 600, fontSize: '18px', color: '#333' }}>
                {hotel.name}
              </h5>
              <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                {hotel.distance}
              </p>
              
              {/* Amenities */}
              <div className="d-flex flex-wrap gap-2 mb-2">
                {hotel.amenities.map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="badge"
                    style={{
                      backgroundColor: amenity.includes('Only') ? '#FFE5E5' : '#E8F5E8',
                      color: amenity.includes('Only') ? '#D63384' : '#0CA04E',
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: '#0CA04E',
                    color: 'white',
                    width: '32px',
                    height: '24px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {hotel.rating}
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  ({hotel.reviews.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price and Button */}
            <div className="text-end">
              <div className="mb-2">
                <div className="d-flex align-items-center justify-content-end gap-2 mb-1">
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#333'
                    }}
                  >
                    ₹{hotel.price.toLocaleString()}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-2 mb-1">
                  {hotel.originalPrice && (
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#999',
                        textDecoration: 'line-through'
                      }}
                    >
                      ₹{hotel.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {hotel.discount && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#0CA04E',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      {hotel.discount}% OFF
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  Per Night
                </p>
              </div>

              <button
                onClick={handleViewDetails}
                className="btn"
                style={{
                  backgroundColor: '#0CA04E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0A8F4A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0CA04E';
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
