/* eslint-disable @next/next/no-img-element  */

import React from 'react';

function getString(v: any): string {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (typeof v === 'object') {
        if (typeof v.name === 'string') return v.name;
        if (typeof v.city === 'string') return v.city;
        if (typeof v.displayName === 'string') return v.displayName;
        if (typeof v.iata === 'string') return v.iata;
        if (typeof v.iataCode === 'string') return v.iataCode;
        if (typeof v.code === 'string') return v.code;
        if (typeof v.station === 'string') return v.station;
        if (typeof v.scheduledTime === 'string') return v.scheduledTime;
        if (typeof v.scheduledTime === 'object') {
            if (typeof v.scheduledTime.time === 'string') return v.scheduledTime.time;
            if (typeof v.scheduledTime.local === 'string') return v.scheduledTime.local;
        }
        if (Array.isArray(v) && v.length > 0) return getString(v[0]);
    }
    return '';
}

export default function MobileFlightCard({ flight }: { flight: any }) {
  // Use same field extraction as desktop FlightCard
  const airline = flight?.airline?.name || 'Unknown Airline';
  const flightNumber = flight?.number || '';
  const aircraftModel = flight?.aircraft?.model || 'Aircraft';
  
  // Use same logo URL pattern as desktop version
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${flight?.airline?.iata}_200_70_r.png`;

  // Extract times using same logic as desktop FlightCard
  const departTime = flight?.departure?.scheduledTime?.local?.split(' ')[1]?.slice(0, 5) || '00:00';
  const arriveTime = flight?.arrival?.scheduledTime?.local?.split(' ')[1]?.slice(0, 5) || '00:00';

  // Extract cities using same logic as desktop FlightCard
  const departCity = flight?.departure?.airport?.name?.split(' ')[0] || '';
  const arriveCity = flight?.arrival?.airport?.name?.split(' ')[0] || '';

  // Use same duration as desktop (can be calculated from datetime if needed)
  const duration = '03h 15m';
  const isNonstop = true;

  // Format price same as desktop
  const price = typeof flight?.price !== 'undefined' ? `₹${flight.price.toLocaleString('en-IN')}` : '—';

  let promo = '';
  if (typeof flight?.promoText === 'string') promo = flight.promoText;
  else if (typeof flight?.offer === 'string') promo = flight.offer;
  else if (typeof flight?.notes === 'string') promo = flight.notes;
  else if (Array.isArray(flight?.offers) && flight.offers.length > 0) promo = getString(flight.offers[0]);

  return (
    <div className="bg-white rounded-3 shadow-sm mb-3" style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Aircraft badge - same as desktop */}
      <div
        style={{
          backgroundColor: '#F6EFCE',
          color: '#866308',
          position: 'absolute',
          top: 0,
          left: 0,
          fontSize: 11,
          fontWeight: 500,
          padding: '4px 8px',
          borderRadius: '0 0 8px 0',
          zIndex: 1
        }}
      >
        {aircraftModel}
      </div>

      <div style={{ padding: 12, paddingTop: 28 }}>
        {/* airline + logo */}
        <div className="d-flex align-items-center mb-3">
          <div style={{ width: 50, height: 35, flexShrink: 0 }} className="me-3 d-flex align-items-center justify-content-center">
            <img
              src={logoUrl}
              alt={`${airline} Logo`}
              style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/fallback-airline-logo.png';
              }}
            />
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: 14 }}>{airline}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>{flightNumber}</div>
          </div>
        </div>

        {/* compact single row with times, duration, price, and button */}
        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: 8 }}>
          {/* Left: Departure time */}
          <div style={{ textAlign: 'left', minWidth: 60 }}>
            <div className="fw-bold" style={{ fontSize: 18, lineHeight: 1 }}>{departTime}</div>
            <div className="text-muted" style={{ fontSize: 11, lineHeight: 1 }}>{departCity}</div>
          </div>

          {/* Center: Duration with line */}
          <div style={{ flex: 1, textAlign: 'center', margin: '0 8px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 2 }}>{duration}</div>
            <div style={{ width: 30, height: 2, background: '#0aa66b', margin: '0 auto 2px', borderRadius: 1 }} />
            <div className="text-muted" style={{ fontSize: 10 }}>{isNonstop ? 'Nonstop' : '1 Stop'}</div>
          </div>

          {/* Right: Arrival time */}
          <div style={{ textAlign: 'right', minWidth: 60 }}>
            <div className="fw-bold" style={{ fontSize: 18, lineHeight: 1 }}>{arriveTime}</div>
            <div className="text-muted" style={{ fontSize: 11, lineHeight: 1 }}>{arriveCity}</div>
          </div>
        </div>

        {/* price & CTA row - single line with better spacing */}
        <div className="d-flex align-items-center justify-content-between" style={{ marginTop: 12 }}>
          <div>
            <div className="fw-bold" style={{ fontSize: 20, color: '#dc3545', lineHeight: 1 }}>{price}</div>
            <div className="text-muted" style={{ fontSize: 12 }}>per adult</div>
          </div>
          
          <button className="btn btn-success" style={{ 
            borderRadius: 20, 
            fontWeight: 700,
            padding: '10px 24px',
            fontSize: 14
          }}>
            BOOK
          </button>
        </div>

        {/* promo row (if exists) - moved below */}
        {promo && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: '#fff3e0', borderRadius: 6, padding: '6px 8px', fontSize: 12, color: '#6b4a1a' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: '#ff6b6b', borderRadius: 6, marginRight: 6 }}></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{promo}</span>
            </div>
          </div>
        )}

        {/* dashed separator */}
        <div style={{ borderTop: '1px dashed #e6e6e6', marginTop: 12, marginBottom: 8 }} />

        {/* lock price / extra row */}
        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: 13 }}>
          <div className="text-muted">Lock this price starting from <strong style={{ color: '#0a7b6a' }}>₹{Math.max(200, Math.round((flight?.price ?? 1000) * 0.07))}</strong></div>
          <div style={{ color: '#0a7b6a', fontWeight: 600 }}>→</div>
        </div>
      </div>
    </div>
  );
}