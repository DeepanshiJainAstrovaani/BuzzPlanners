/* eslint-disable @next/next/no-img-element  */

import React from 'react';

function getString(v: any) {
  if (!v && v !== 0) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    if (typeof v.name === 'string') return v.name;
    if (typeof v.title === 'string') return v.title;
    if (typeof v.label === 'string') return v.label;
    if (Array.isArray(v) && v.length) return getString(v[0]);
  }
  return '';
}

function getImageUrl(v: any) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const keys = ['image', 'imageUrl', 'url', 'thumbnail', 'thumb', 'src', 'photo'];
    for (const k of keys) {
      if (typeof v[k] === 'string') return v[k];
    }
    if (Array.isArray(v) && v.length) return getImageUrl(v[0]);
  }
  return '';
}

export default function MobileTravelPackageCard({ pkg }: { pkg: any }) {
  // Use same fields as desktop TravelPackageCard
  const title = pkg?.title || 'Kasauli 3D/2N Trip From Delhi';
  const subtitle = 'Delhi to Delhi';
  const price = typeof pkg?.price !== 'undefined' ? `₹${pkg.price.toLocaleString('en-IN')}` : '₹5500';
  
  // Use same image paths as desktop version
  const mainImage = '/images/stay1.png';
  
  return (
    <div style={{ padding: 8 }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        padding: 14, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        {/* Header with star badge */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ 
            width: '100%', 
            height: 120, 
            background: '#f3f3f3', 
            borderRadius: 8, 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={mainImage} 
              alt={title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              loading="lazy" 
            />
            {/* Star badge overlay */}
            <span
              style={{
                backgroundColor: '#F6EFCE',
                color: '#866308',
                position: 'absolute',
                top: 0,
                left: 0,
                fontWeight: 500,
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: '8px 0 8px 0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              ⭐ {pkg?.star || '4'} Star
            </span>
          </div>
        </div>

        {/* Title and subtitle */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: 16, 
            lineHeight: '20px',
            marginBottom: 4,
            color: '#333'
          }}>{title}</div>
          <div style={{ 
            color: '#666', 
            fontSize: 12, 
            lineHeight: '16px'
          }}>{subtitle}</div>
        </div>

        {/* Amenities icons */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 8,
          alignItems: 'center'
        }}>
          {(pkg?.flights !== false) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#F5F5F5',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/icons/airplane.png" alt="Flights" width={16} height={16} />
              </div>
              <span style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Flights</span>
            </div>
          )}
          
          {(pkg?.stay !== false) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#F5F5F5',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/icons/stay.png" alt="Stay" width={16} height={16} />
              </div>
              <span style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Stay</span>
            </div>
          )}
          
          {(pkg?.meals !== false) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#F5F5F5',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/icons/dinner.png" alt="Meals" width={16} height={16} />
              </div>
              <span style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Meals</span>
            </div>
          )}
          
          <div style={{ color: '#0a7b6a', fontSize: 11, fontWeight: 600 }}>+3 more</div>
        </div>

        {/* Seats left warning */}
        {(pkg?.seatsLeft === 'few' || !pkg?.seatsLeft) && (
          <div style={{ 
            color: '#FF5F5F', 
            fontSize: 12, 
            fontWeight: 500,
            marginBottom: 10
          }}>
            Only few seats left
          </div>
        )}

        {/* Price and CTA section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: 8,
          borderTop: '1px solid #f0f0f0'
        }}>
          <div>
            {pkg?.specialOffer && (
              <div style={{
                background: '#ffe9c7',
                color: '#b05a00',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                marginBottom: 4
              }}>
                Special Offer
              </div>
            )}
            <div style={{ 
              color: '#0a7b6a', 
              fontWeight: 800, 
              fontSize: 18,
              lineHeight: '22px'
            }}>{price}</div>
            <div style={{ 
              color: '#666', 
              fontSize: 11,
              fontWeight: 500
            }}>Price Per Person</div>
          </div>
          
          <button 
            className="btn btn-success btn-sm" 
            style={{ 
              borderRadius: 20, 
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 700,
              minWidth: 70
            }}
          >
            BOOK
          </button>
        </div>
      </div>
    </div>
  );
}