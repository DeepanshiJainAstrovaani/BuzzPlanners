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

function getImageUrl(v: any): string {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
        const candidates = [
            'url', 'src', 'href', 'image', 'logo', 'logoUrl', 'imageUrl', 'path', 'file', 'thumb', 'thumbnail'
        ];
        for (const k of candidates) {
            const val = v[k];
            if (typeof val === 'string' && val.length > 0) return val;
            if (typeof val === 'object') {
                if (typeof val.url === 'string') return val.url;
                if (typeof val.src === 'string') return val.src;
            }
        }
        if (typeof v.toString === 'function') {
            const s = String(v);
            if (s.startsWith('http')) return s;
        }
        if (Array.isArray(v) && v.length > 0) return getImageUrl(v[0]);
    }
    return '';
}

export default function MobileFlightCard({ flight }: { flight: any }) {
  const airline = getString(flight?.airline?.name) || getString(flight?.airline) || getString(flight?.marketingAirline) || 'Unknown Airline';
  const logoUrl =
    getImageUrl(flight?.airline?.logo) ||
    getImageUrl(flight?.airline?.image) ||
    getImageUrl(flight?.image) ||
    getImageUrl(flight?.logo) ||
    '';

  const departTime =
    getString(flight?.departure?.scheduledTime) ||
    getString(flight?.departure?.time) ||
    getString(flight?.departureTime) ||
    getString(flight?.dep_time) ||
    getString(flight?.dep) ||
    '00:00';

  const arriveTime =
    getString(flight?.arrival?.scheduledTime) ||
    getString(flight?.arrival?.time) ||
    getString(flight?.arrivalTime) ||
    getString(flight?.arr_time) ||
    getString(flight?.arr) ||
    '00:00';

  const departCity =
    getString(flight?.departure?.airport) ||
    getString(flight?.origin) ||
    getString(flight?.departure?.name) ||
    getString(flight?.from) ||
    '';

  const arriveCity =
    getString(flight?.arrival?.airport) ||
    getString(flight?.destination) ||
    getString(flight?.arrival?.name) ||
    getString(flight?.to) ||
    '';

  const duration =
    getString(flight?.duration) ||
    getString(flight?.flight_time) ||
    getString(flight?.elapsedTime) ||
    getString(flight?.travelTime) ||
    '—';

  const price = typeof flight?.price !== 'undefined' ? `₹${flight.price}` : '—';

  let promo = '';
  if (typeof flight?.promoText === 'string') promo = flight.promoText;
  else if (typeof flight?.offer === 'string') promo = flight.offer;
  else if (typeof flight?.notes === 'string') promo = flight.notes;
  else if (Array.isArray(flight?.offers) && flight.offers.length > 0) promo = getString(flight.offers[0]);

  return (
    <div className="bg-white rounded-3 shadow-sm mb-3" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 12 }}>
        {/* airline + logo */}
        <div className="d-flex align-items-center mb-2">
          <div style={{ width: 40, height: 40, flexShrink: 0 }} className="me-2 d-flex align-items-center justify-content-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={airline}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 6 }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center text-muted small">✈</div>
            )}
          </div>
          <div className="fw-semibold" style={{ fontSize: 14 }}>{airline}</div>
        </div>

        {/* main times row */}
        <div className="d-flex align-items-center">
          <div style={{ width: '100%', minWidth: 0 }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold" style={{ fontSize: 20 }}>{departTime}</div>
                <div className="text-muted small text-truncate" style={{ maxWidth: 120 }}>{departCity}</div>
              </div>

              <div style={{ flex: 1 }} className="text-center">
                <div style={{ fontSize: 12 }} className="text-muted">{duration}</div>
                <div style={{ height: 6 }} />
                <div style={{ width: 40, height: 4, background: '#0aa66b', margin: '6px auto', borderRadius: 2 }} />
                <div style={{ height: 6 }} />
                <div className="text-muted small">Non stop</div>
              </div>

              <div style={{ width: 100, textAlign: 'right', flexShrink: 0 }}>
                <div className="fw-bold" style={{ fontSize: 18 }}>{arriveTime}</div>
                <div className="text-muted small text-truncate" style={{ maxWidth: 100 }}>{arriveCity}</div>
              </div>
            </div>
          </div>
        </div>

        {/* price & CTA row */}
        <div className="d-flex align-items-center mt-3">
          <div className="flex-grow-1">
            {promo ? (
              <div style={{ background: '#fff3e0', borderRadius: 6, padding: '8px 10px', fontSize: 13, color: '#6b4a1a' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, background: '#ff6b6b', borderRadius: 8, marginRight: 8 }}></span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{promo}</span>
              </div>
            ) : null}
          </div>

          <div style={{ width: 110, textAlign: 'right', marginLeft: 12, flexShrink: 0 }}>
            <div className="fw-bold text-dark" style={{ fontSize: 18 }}>{price}</div>
            <div className="text-muted small">per adult</div>
            <div style={{ height: 6 }} />
            <button className="btn btn-success btn-sm w-100" style={{ borderRadius: 20, fontWeight: 600 }}>BOOK</button>
          </div>
        </div>

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