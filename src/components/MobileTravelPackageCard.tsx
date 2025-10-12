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
  const title = getString(pkg?.title || pkg?.name || pkg?.destination);
  const subtitle = getString(pkg?.subtitle || pkg?.sublabel || pkg?.location);
  const price = typeof pkg?.price !== 'undefined' ? `₹${pkg.price}` : '—';
  const img = getImageUrl(pkg?.image || pkg?.images || pkg?.thumb);

  return (
    <div style={{ padding: 12 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 84, height: 64, flexShrink: 0, background: '#f3f3f3', borderRadius: 8, overflow: 'hidden' }}>
            {img ? (
              <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>IMG</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={title}>{title}</div>
            {subtitle ? <div style={{ color: '#666', fontSize: 13, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div> : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ color: '#0a7b6a', fontWeight: 700 }}>{price}</div>
              <button className="btn btn-success btn-sm" style={{ borderRadius: 20, padding: '6px 12px' }}>BOOK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}