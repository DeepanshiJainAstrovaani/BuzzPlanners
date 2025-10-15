/* eslint-disable @next/next/no-img-element */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MobileHotelCard({ hotel }: { hotel: any }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/hotels/${hotel.id}`);
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: '12px',
        padding: '16px',
        background: '#fff',
        marginBottom: '16px'
      }}
    >
      {/* Hotel Image */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '180px',
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
        
        {/* Price Badge */}
        <div
          className="position-absolute"
          style={{
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          ₹{hotel.price.toLocaleString()}
        </div>
      </div>

      {/* Hotel Details */}
      <div>
        <h5 className="mb-2" style={{ fontWeight: 600, fontSize: '16px', color: '#333', lineHeight: '1.3' }}>
          {hotel.name}
        </h5>
        
        <p className="text-muted mb-2" style={{ fontSize: '13px' }}>
          {hotel.distance}
        </p>
        
        {/* Amenities */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {hotel.amenities.map((amenity: string, index: number) => (
            <span
              key={index}
              className="badge"
              style={{
                backgroundColor: amenity.includes('Only') ? '#FFE5E5' : '#E8F5E8',
                color: amenity.includes('Only') ? '#D63384' : '#0CA04E',
                fontSize: '10px',
                fontWeight: 500,
                padding: '2px 6px',
                borderRadius: '10px'
              }}
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Bottom Row: Rating, Price, and Button in one line */}
        <div className="d-flex justify-content-between align-items-center">
          {/* Rating */}
          

          {/* Price and Button Section */}
          <div className="d-flex align-items-center gap-2">
            {/* Original Price and Discount */}
            {hotel.originalPrice && (
              <div className="d-flex align-items-center gap-1">
                <span
                  style={{
                    fontSize: '12px',
                    color: '#999',
                    textDecoration: 'line-through'
                  }}
                >
                  ₹{hotel.originalPrice.toLocaleString()}
                </span>
                {hotel.discount && (
                  <span
                    className="badge"
                    style={{
                      backgroundColor: '#0CA04E',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 600,
                      padding: '1px 4px',
                      borderRadius: '3px'
                    }}
                  >
                    {hotel.discount}% OFF
                  </span>
                )}
              </div>
            )}
            
            {/* Current Price */}
            <div className="d-flex align-items-baseline gap-1">
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#333',
                  lineHeight: '1'
                }}
              >
                ₹{hotel.price.toLocaleString()}
              </span>
              <span style={{ fontSize: '12px', color: '#666' }}>/night</span>
            </div>
            
            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="btn fs-6"
              style={{
                backgroundColor: '#0CA04E',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
