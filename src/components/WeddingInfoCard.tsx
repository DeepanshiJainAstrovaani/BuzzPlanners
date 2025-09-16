import React from 'react';
import Link from 'next/link';

export default function WeddingInfoCard({ wedding }: { wedding: any }) {
  // Debug log to verify presence of weddingId in UI layer
  if (typeof window !== 'undefined') {
    // Avoid noisy logs by only logging minimal info
    // eslint-disable-next-line no-console
    console.log('[WeddingInfoCard] wedding:', { _id: wedding?._id, weddingId: wedding?.weddingId, title: wedding?.title });
  }
  return (
    <div style={{ background: '#FBF3DB', borderRadius: 16, padding: 24, marginBottom: 24, position: 'relative', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 20, marginBottom: 4 }}>{wedding.weddingId || ''}</div>
      <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
        {wedding.title}
      </div>
      <div style={{ fontSize: 20, color: '#222', marginBottom: 12 }}>
        {(() => {
          if (!wedding.date) return '';
          // Try to parse as ISO or fallback to DD/MM/YYYY
          const parts = wedding.date.split('/');
          let dateObj;
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
      <hr style={{ border: 'none', borderTop: '2px solid #E2D29C', margin: '12px 0' }} />
      <div style={{ fontSize: 20, marginBottom: 4 }}>
        <b>Venue:</b> {wedding.venue}
      </div>
      <div style={{ fontSize: 20, marginBottom: 4 }}>
        <b>Contact Person:</b> {wedding.contactPersonGroomSide} ({wedding.mobileGroomSide})
      </div>
      {/* Edit link navigates to create page in edit mode with Mongo _id to match current page query parsing */}
      <Link
        href={`/dashboard/wedding-management/create?edit=1&id=${encodeURIComponent(wedding?._id || '')}`}
        style={{
          position: 'absolute',
          right: 24,
          top: 24,
          border: '1px solid #222',
          borderRadius: 8,
          background: '#FBF3DB',
          fontWeight: 500,
          fontSize: 20,
          padding: '6px 24px',
          cursor: 'pointer',
          color: '#222',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        Edit
      </Link>
    </div>
  );
}
