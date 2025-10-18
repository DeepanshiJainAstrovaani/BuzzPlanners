'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './WeddingInfoCard.module.css';

export default function WeddingInfoCard({ wedding }: { wedding: any }) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  // Debug log to verify presence of weddingId in UI layer
  if (typeof window !== 'undefined') {
    // Avoid noisy logs by only logging minimal info
    console.log('[WeddingInfoCard] wedding:', { _id: wedding?._id, weddingId: wedding?.weddingId, title: wedding?.title });
  }
  return (
    <div className={styles.infoCard}>
      <div className={styles.topRow}>
        <div className={styles.leftCol}>
          <div className={styles.idText}>{wedding.weddingId || ''}</div>
          <div className={styles.titleText}>{wedding.title}</div>
          <div className={styles.dateText}>
            {(() => {
              if (!wedding.date) return '';
              // Try to parse as ISO or fallback to DD/MM/YYYY
              const parts = String(wedding.date).split('/');
              let dateObj: Date;
              if (parts.length === 3) {
                // Format: DD/MM/YYYY
                dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              } else {
                // Try ISO or other
                dateObj = new Date(wedding.date);
              }
              if (isNaN(dateObj.getTime())) return wedding.date;
              return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            })()}
          </div>
        </div>
        <div className={styles.actionButtons}>
          {/* Edit link navigates to create page in edit mode with Mongo _id to match current page query parsing */}
          <Link
            href={`/dashboard/wedding-management/create?edit=1&id=${encodeURIComponent(wedding?._id || '')}`}
            className={styles.editLink}
          >
            Edit
          </Link>
          
          {/* PDF Preview Button */}
          <button
            onClick={() => setShowPdfPreview(true)}
            className={styles.previewButton}
            title="Preview PDF Design"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <hr className={styles.divider} />
      <div className={styles.kv}><b>Venue:</b> {wedding.venue}</div>
      <div className={styles.kv}><b>Contact Person:</b> {wedding.contactPersonGroomSide} ({wedding.mobileGroomSide})</div>
      
      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className={styles.modalOverlay} onClick={() => setShowPdfPreview(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Wedding PDF Design Preview</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowPdfPreview(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.pdfContainer}>
              <PdfDesignPreview wedding={wedding} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PDF Design Preview Component
function PdfDesignPreview({ wedding }: { wedding: any }) {
  // Extract names from title like "Jatin weds Roshni"
  const getGroomAndBrideName = () => {
    if (wedding.groomName && wedding.brideName) {
      return { groom: wedding.groomName, bride: wedding.brideName };
    }
    
    // Parse from title like "Jatin weds Roshni"
    if (wedding.title) {
      const parts = wedding.title.split(' weds ');
      if (parts.length === 2) {
        return { groom: parts[0].trim(), bride: parts[1].trim() };
      }
    }
    
    return { groom: 'Groom Name', bride: 'Bride Name' };
  };
  
  const { groom, bride } = getGroomAndBrideName();
  
  return (
    <>
      <div className="pdf-sheet" aria-label="Save The Date Wedding Invitation">
        <div className="content">
          <div className="save-the-date-header">Save The Date</div>
          <div className="for-wedding-text">FOR THE WEDDING OF</div>
          
          <div className="names-section">
            <div className="groom-name">{groom}</div>
            <div className="ampersand">&</div>
            <div className="bride-name">{bride}</div>
          </div>

          <div className="invitation-text">YOU ARE INVITED TO JOIN THE PARTY</div>

          <div className="date-section">
            <div className="month-text">{formatMonth(wedding.date)}</div>
            
            <div className="date-details-row">
              <div className="line"></div>
              <div className="day-name">{formatDayName(wedding.date)}</div>
              <div className="day-circle">{formatDay(wedding.date)}</div>
              <div className="time-text">{wedding.time || '6:00 PM'}</div>
              <div className="line"></div>
            </div>

            <div className="year-text">{formatYear(wedding.date)}</div>
          </div>

          <div className="venue-text">{wedding.venue || 'Venue Name'}</div>
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
          width: min(600px, 100%); 
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
          padding: 80px 50px; 
          width: 100%; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
        }

        .save-the-date-header {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 3px;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 5px;
        }

        .for-wedding-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .names-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 25px 0;
        }

        .groom-name, .bride-name {
          font-family: 'Great Vibes', cursive;
          font-size: 3.8rem;
          font-weight: 400;
          color: #c89541;
          line-height: 1;
          text-shadow: 0 2px 6px rgba(0,0,0,0.15);
          margin: 0;
        }

        .ampersand {
          font-family: 'Great Vibes', cursive;
          font-size: 2.2rem;
          color: #c89541;
          margin: -8px 0;
          line-height: 1;
        }

        .invitation-text {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 10px 0;
        }

        .date-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          position: relative;
        }

        .month-text {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #3d5479;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .date-details-row {
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          max-width: 400px;
          justify-content: center;
          position: relative;
        }

        .line {
          flex: 1;
          height: 2px;
          background: #c89541;
          max-width: 80px;
        }

        .day-name, .time-text {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 600;
          color: #3d5479;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .day-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #6b7280;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: bold;
        }

        .year-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 600;
          color: #3d5479;
          letter-spacing: 0.05em;
        }

        .venue-text {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 500;
          color: #3d5479;
          letter-spacing: 0.1em;
          margin-top: 10px;
          line-height: 1.3;
          max-width: 80%;
        }
      `}</style>
    </>
  );
}

// Helper functions to format date
function formatMonth(dateStr: string): string {
  if (!dateStr) return 'NOVEMBER';
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
}

function formatDay(dateStr: string): string {
  if (!dateStr) return '20';
  const date = parseDate(dateStr);
  return date.getDate().toString();
}

function formatDayName(dateStr: string): string {
  if (!dateStr) return 'SUNDAY';
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
}

function formatYear(dateStr: string): string {
  if (!dateStr) return '2026';
  const date = parseDate(dateStr);
  return date.getFullYear().toString();
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // Try to parse DD/MM/YYYY format first
  const parts = String(dateStr).split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  
  // Fallback to other formats
  return new Date(dateStr);
}
