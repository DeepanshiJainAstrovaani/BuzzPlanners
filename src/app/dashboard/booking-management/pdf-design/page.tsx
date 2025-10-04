'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// Static HTML design preview for Booking related PDF (e.g., Booking Confirmation / Itinerary Cover)
// Adapted from wedding PDF design and relocated under booking-management.
// Later integrate dynamic data + real PDF generation.
// Background image expected at /public/images/background.png
// Custom font 'Youngest' expected at /public/fonts/youngest/Youngest-Regular.ttf

export default function BookingPdfDesignPage() {
  const router = useRouter();

  const data = {
    title: 'Travel Booking Confirmation',
    travelerName: 'Mr. Arjun Mehta',
    bookingRef: 'BK-904233',
    tripTitle: 'Romantic Getaway to Bali',
    startDate: '14 Nov 2025',
    endDate: '21 Nov 2025',
    contactPhone: '+91 98765 11111',
    contactEmail: 'support@buzzplanners.com'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={btnStyle}>Back</button>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Booking PDF Design Preview</div>
        <button style={{ ...btnStyle, background: '#2BB96B', color: '#fff', borderColor: '#2BB96B' }} onClick={() => alert('PDF export coming soon')}>Export (Coming Soon)</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#ddd', padding: '30px 20px' }}>
        <div className="pdf-sheet" aria-label="Booking PDF Design">
          <div className="overlay" />
          <div className="content">
            <div className="badge">Booking</div>
            <h1 className="title">{data.tripTitle}</h1>
            <div className="block ref-block">
              <label>Reference</label>
              <div className="value">{data.bookingRef}</div>
            </div>
            <div className="block name-block">
              <label>Traveler</label>
              <div className="value big">{data.travelerName}</div>
            </div>
            <div className="dates">
              <div className="date-item">
                <span>Start</span>
                <strong>{data.startDate}</strong>
              </div>
              <div className="sep" />
              <div className="date-item">
                <span>End</span>
                <strong>{data.endDate}</strong>
              </div>
            </div>
            <div className="contact">
              <div>{data.contactPhone}</div>
              <div>{data.contactEmail}</div>
            </div>
            <div className="footer-note">Thank you for choosing Buzz Planners</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#555' }}>Page preview (A4 ratio approximation).</div>
      </div>

      <style jsx>{`
        @font-face { font-family: 'Youngest'; src: url('/fonts/youngest/Youngest-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
        /* PDF sheet with decorative background image (place your custom background at /public/images/background.png). */
        .pdf-sheet { position: relative; margin: 0 auto; background: #fff linear-gradient(135deg,#f5f9fa 0%, #eef7f9 40%, #e8f2f5 100%); width: min(794px, 100%); aspect-ratio: 210/297; box-shadow: 0 6px 28px rgba(0,0,0,0.18); border: 1px solid #d2d2d2; border-radius: 6px; overflow: hidden; display:flex; align-items:center; justify-content:center; }
        /* When the background.png exists it will overlay the gradient. */
        .pdf-sheet { background-image: url('/images/background.png'); background-size: cover, cover; background-position: center, center; background-blend-mode: normal, multiply; }
        .overlay { position:absolute; inset:0; background: rgba(255,255,255,0.6); backdrop-filter: blur(1px); }
        .content { position:relative; text-align:center; padding: 58px 54px 48px; width:100%; height:100%; font-family: 'Youngest', 'Helvetica Neue', Arial, sans-serif; color:#183b3e; display:flex; flex-direction:column; justify-content:center; }
        .badge { font-size:13px; letter-spacing:3px; text-transform:uppercase; font-weight:600; color:#0f5d66; margin-bottom:18px; }
        .title { font-size: clamp(34px, 5vw, 56px); font-weight:400; line-height:1.05; margin:0 0 32px; font-family: 'Youngest'; }
        .block { margin-bottom:28px; }
        .block label { display:block; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; color:#9b6a2c; margin-bottom:6px; }
        .block .value { font-size:18px; font-weight:500; }
        .block .value.big { font-size:24px; font-weight:600; }
        .dates { display:flex; align-items:stretch; justify-content:center; gap:22px; margin: 6px 0 38px; }
        .date-item { display:flex; flex-direction:column; gap:6px; min-width:130px; }
        .date-item span { font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; color:#9b6a2c; }
        .date-item strong { font-size:18px; font-weight:600; }
        .sep { width:1px; background: linear-gradient(180deg, transparent, #c47a3c 35%, #c47a3c 65%, transparent); }
        .contact { font-size:14px; font-weight:500; color:#2f2f2f; display:flex; flex-direction:column; gap:4px; margin-bottom:34px; }
        .footer-note { font-size:13px; letter-spacing:1px; color:#555; font-weight:500; }
        @media (max-width: 640px) { .content { padding: 46px 34px 40px; } .dates { flex-direction:column; gap:14px; } .sep { display:none; } }
      `}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: '#fff',
  color: '#222',
  border: '1px solid #ccc',
  borderRadius: 8,
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  lineHeight: 1,
};
