'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function WeddingPdfDesignPage() {
  const router = useRouter();

  // Static sample data (replace with dynamic later)
  const data = {
    bride: 'Meena Rana',
    groom: 'Rajesh Shah'
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
          <div className="overlay" />
          <div className="content">
            <div className="save-the-date-header">Save The Date</div>
            <div className="for-wedding-text">FOR THE WEDDING OF</div>
            
            <div className="names-section">
              <div className="groom-name">{data.groom}</div>
              <div className="ampersand">&</div>
              <div className="bride-name">{data.bride}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#555' }}>Save The Date design preview with floral background.</div>
      </div>

      <style jsx>{`
        @font-face { font-family: 'Youngest'; src: url('/fonts/youngest/Youngest-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
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
          padding: 40px 60px; 
          width: 100%; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          justify-content: flex-start; 
          align-items: center;
          padding-top: 150px;
        }

        .save-the-date-header {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 200;
          color: #2c4a6b;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          line-height: 1.1;
        }

        .for-wedding-text {
          font-family: 'Playfair Display', serif;
          font-size: 25px;
          font-weight: 500;
          color: #2c4a6b;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 60px;
        }

        .names-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .groom-name, .bride-name {
          font-family: 'Great Vibes', 'Alex Brush', 'Dancing Script', cursive;
          font-size: 68px;
          font-weight: 400;
          color: #d4a574;
          line-height: 0.85;
          text-shadow: 0 2px 6px rgba(0,0,0,0.15);
          font-style: italic;
        }

        .ampersand {
          font-family: 'Great Vibes', 'Alex Brush', cursive;
          font-size: 52px;
          color: #d4a574;
          margin: 8px 0;
          transform: rotate(-8deg);
          font-style: italic;
        }

        @media (max-width: 860px) { 
          .pdf-sheet { aspect-ratio: auto; height: auto; }
          .content { padding-top: 80px; }
          .save-the-date-header { font-size: 48px; }
          .groom-name, .bride-name { font-size: 52px; }
          .ampersand { font-size: 40px; }
        }
        
        @media (max-width: 640px) { 
          .content { padding: 60px 40px; padding-top: 150px; }
          .save-the-date-header { font-size: 36px; }
          .groom-name, .bride-name { font-size: 40px; }
          .for-wedding-text { font-size: 16px; }
        }
        
        @media (max-width: 480px) { 
          .save-the-date-header { font-size: 30px; }
          .groom-name, .bride-name { font-size: 34px; }
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
