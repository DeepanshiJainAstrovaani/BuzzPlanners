'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function WeddingPdfDesignPage() {
  const router = useRouter();

  // Static sample data (replace with dynamic later)
  const data = {
    bride: 'Meena Rana',
    groom: 'Rajesh Shah',
    date: {
      month: 'NOVEMBER',
      day: '20',
      dayName: 'SUNDAY',
      time: 'AT 8 PM',
      year: '2026'
    },
    venue: '123 Anywhere St., Any City'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={btnStyle}>Back</button>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Wedding PDF Design Preview</div>
        <button style={{ ...btnStyle, background: '#2BB96B', color: '#fff', borderColor: '#2BB96B' }} onClick={() => alert('Later this will trigger PDF export')}>Export (Coming Soon)</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#ddd', padding: '30px 20px' }}>
        <div className="pdf-sheet" aria-label="Save The Date Wedding Invitation">
          <div className="content">
            <div className="save-the-date-header">Save The Date</div>
            <div className="for-wedding-text">FOR THE WEDDING OF</div>
            
            <div className="names-section">
              <div className="groom-name">{data.groom}</div>
              <div className="ampersand">&</div>
              <div className="bride-name">{data.bride}</div>
            </div>

            {/* Invitation Text */}
            <div className="invitation-text">YOU ARE INVITED TO JOIN THE PARTY</div>

            {/* Date Details */}
            <div className="date-section">
              <div className="month-text">{data.date.month}</div>
              
              <div className="date-details-row">
                <div className="line"></div>
                <div className="day-name">{data.date.dayName}</div>
                <div className="day-circle">{data.date.day}</div>
                <div className="time-text">{data.date.time}</div>
                <div className="line"></div>
              </div>

              <div className="year-text">{data.date.year}</div>
            </div>

            {/* Venue */}
            <div className="venue-text">{data.venue}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Great+Vibes&display=swap');
        
        :root {
          --navy: 210 45% 28%;
          --gold: 35 45% 62%;
        }
        
        .pdf-sheet { 
          position: relative; 
          margin: 0 auto; 
          background: #fff url('/images/background.png') center/cover no-repeat; 
          width: min(794px, 100%); 
          aspect-ratio: 210/297; 
          box-shadow: 0 6px 28px rgba(0,0,0,0.18); 
          border: 1px solid #d2d2d2; 
          border-radius: 6px; 
          overflow: hidden; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        
        .content { 
          position: relative; 
          text-align: center; 
          padding: 40px 50px; 
          width: 100%; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center;
          gap: 16px;
        }

        .save-the-date-header {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 2px;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .for-wedding-text {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .names-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin: 30px 0;
        }

        .groom-name, .bride-name {
          font-family: 'Great Vibes', cursive;
          font-size: 5rem;
          font-weight: 400;
          color: #c89541;
          line-height: 0.9;
          text-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .ampersand {
          font-family: 'Great Vibes', cursive;
          font-size: 4rem;
          color: #c89541;
          transform: rotate(-8deg);
        }

        .invitation-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 8px 0;
        }

        .date-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
          position: relative;
        }

        .date-section::before,
        .date-section::after {
          content: '';
          display: block;
          width: 120px;
          height: 2px;
          background-color: #d4941e; /* Orange color */
          margin: 0 auto;
        }

        .date-section::before {
          margin-bottom: 15px;
        }

        .date-section::after {
          margin-top: 15px;
        }

        .month-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: hsl(var(--navy));
          letter-spacing: 0.15em;
        }

        .date-details-row {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          max-width: 450px;
          justify-content: center;
        }

        .line {
          flex: 1;
          height: 1px;
          background: hsl(var(--gold));
          max-width: 80px;
        }

        .day-name, .time-text {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 500;
          color: hsl(var(--navy));
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .day-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #4a5568; /* Darker blue-gray */
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: bold;
        }

        .year-text {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 600;
          color: hsl(var(--navy));
          letter-spacing: 0.05em;
        }

        .venue-text {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 500;
          color: hsl(var(--navy));
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        @media (max-width: 860px) { 
          .pdf-sheet { aspect-ratio: auto; height: auto; }
          .content { padding: 30px 40px; gap: 14px; }
          .save-the-date-header { font-size: 36px; }
          .groom-name, .bride-name { font-size: 42px; }
          .ampersand { font-size: 34px; }
          .day-circle { width: 45px; height: 45px; font-size: 20px; }
        }
        
        @media (max-width: 640px) { 
          .content { padding: 25px 30px; gap: 12px; }
          .save-the-date-header { font-size: 28px; }
          .groom-name, .bride-name { font-size: 32px; }
          .for-wedding-text { font-size: 12px; }
          .ampersand { font-size: 26px; }
          .month-text { font-size: 16px; }
          .day-name, .time-text { font-size: 12px; }
          .day-circle { width: 40px; height: 40px; font-size: 18px; }
          .year-text { font-size: 20px; }
          .venue-text { font-size: 11px; }
          .line { max-width: 50px; }
        }
        
        @media (max-width: 480px) { 
          .save-the-date-header { font-size: 24px; }
          .groom-name, .bride-name { font-size: 28px; }
          .ampersand { font-size: 22px; }
          .month-text { font-size: 14px; }
          .year-text { font-size: 18px; }
        }
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
