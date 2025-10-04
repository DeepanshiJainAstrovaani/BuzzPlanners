'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

// NOTE: This is a static HTML design preview for the Wedding PDF.
// Later you can fetch real data (groom/bride names, date/time, venue, etc.) and generate a PDF.
// Place the custom 'Youngest' font files inside /public/fonts/youngest/ (e.g., Youngest-Regular.ttf)
// Background image expected at /public/images/background.png (add it if not present yet).

export default function WeddingPdfDesignPage() {
  const router = useRouter();

  // Static sample data (replace with dynamic later)
  const data = {
    bride: 'Neha Sharma',
    groom: 'Rahul Verma',
    date: 'Saturday, 09 November 2025',
    time: '6:30 PM',
    venueLine1: 'The Royal Heritage Palace',
    venueLine2: 'Lakeview Road, Jaipur, Rajasthan',
    rsvpPhone: '+91 98765 43210',
    rsvpEmail: 'family@example.com'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={btnStyle}>Back</button>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Wedding PDF Design Preview</div>
        <button style={{ ...btnStyle, background: '#2BB96B', color: '#fff', borderColor: '#2BB96B' }} onClick={() => alert('Later this will trigger PDF export')}>Export (Coming Soon)</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#ddd', padding: '30px 20px' }}>
        <div className="pdf-sheet" aria-label="Wedding Invitation PDF Design">
          <div className="overlay" />
          <div className="content">
            <div className="top-accent">Celebrating The Union Of</div>
            <h1 className="names">
              <span className="groom">{data.groom}</span>
              <span className="and">&amp;</span>
              <span className="bride">{data.bride}</span>
            </h1>
            <div className="divider">
              <span />
              <em>Invite You</em>
              <span />
            </div>
            <p className="invite-line">To Join Us In Our Wedding Celebration</p>
            <div className="date-block">
              <div className="date-line">{data.date}</div>
              <div className="time-line">at {data.time}</div>
            </div>
            <div className="venue-block">
              <div>{data.venueLine1}</div>
              <div>{data.venueLine2}</div>
            </div>
            <div className="rsvp-label">RSVP</div>
            <div className="rsvp-block">
              <div>{data.rsvpPhone}</div>
              <div>{data.rsvpEmail}</div>
            </div>
            <div className="footer-note">We look forward to celebrating with you</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#555' }}>Page preview (A4 ratio approximation). Background and fonts for reference only.</div>
      </div>

      <style jsx>{`
        @font-face { font-family: 'Youngest'; src: url('/fonts/youngest/Youngest-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');

        .pdf-sheet { position: relative; margin: 0 auto; background: #fff url('/images/background.png') center/cover no-repeat; width: min(794px, 100%); aspect-ratio: 210/297; box-shadow: 0 6px 28px rgba(0,0,0,0.18); border: 1px solid #d2d2d2; border-radius: 6px; overflow: hidden; display:flex; align-items:center; justify-content:center; }
        .pdf-sheet .overlay { position:absolute; inset:0; background: rgba(255,255,255,0.58); backdrop-filter: blur(1px); }
        .pdf-sheet .content { position:relative; text-align:center; padding: 58px 54px 48px; width:100%; height:100%; font-family: 'Youngest', 'Helvetica Neue', Arial, sans-serif; color:#333; display:flex; flex-direction:column; justify-content:center; }

        .top-accent { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; font-weight: 500; color:#555; margin-bottom: 26px; }
        .names { font-family: 'Alex Brush', cursive; font-size: clamp(50px, 10vw, 92px); font-weight: 400; line-height: 0.95; margin: 0 0 24px; color:#1d4d4f; display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap: 14px; }
        .names .and { font-family: 'Youngest'; font-size: clamp(28px, 4vw, 44px); color:#c47a3c; position:relative; top: 4px; }
        .divider { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .divider span { flex:1; height:1px; background: linear-gradient(90deg, transparent, #c47a3c 35%, #c47a3c 65%, transparent); }
        .divider em { font-style: normal; font-size:12px; letter-spacing: 2px; text-transform: uppercase; color:#a16224; font-weight:600; }
        .invite-line { font-size: 14px; letter-spacing:1.5px; text-transform: uppercase; color:#555; margin: 0 0 28px; font-weight:500; }
        .date-block { font-size:18px; font-weight:500; color:#1b3b40; margin-bottom:24px; line-height:1.25; }
        .date-block .date-line { font-size:20px; font-weight:600; }
        .date-block .time-line { font-size:16px; margin-top:4px; color:#2e5c61; }
        .venue-block { font-size:16px; font-weight:500; line-height:1.4; color:#3b3b3b; margin-bottom:32px; }
        .venue-block div:first-child { font-weight:600; font-size:18px; }
        .rsvp-label { font-size:12px; letter-spacing: 3px; font-weight:600; color:#a16224; text-transform:uppercase; margin-bottom:10px; }
        .rsvp-block { font-size:14px; font-weight:500; color:#2f2f2f; display:flex; flex-direction:column; gap:4px; margin-bottom:38px; }
        .footer-note { font-size:13px; letter-spacing:1px; color:#555; font-weight:500; }

        @media (max-width: 860px) { .pdf-sheet { aspect-ratio:auto; height:auto; } }
        @media (max-width: 640px) { .pdf-sheet .content { padding: 46px 38px 40px; } }
        @media (max-width: 480px) { .names { font-size: clamp(44px, 14vw, 78px); } }
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
