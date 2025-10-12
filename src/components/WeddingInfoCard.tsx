'use client';

import React from 'react';
import Link from 'next/link';
import styles from './WeddingInfoCard.module.css';

export default function WeddingInfoCard({ wedding }: { wedding: any }) {
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
        {/* Edit link navigates to create page in edit mode with Mongo _id to match current page query parsing */}
        <Link
          href={`/dashboard/wedding-management/create?edit=1&id=${encodeURIComponent(wedding?._id || '')}`}
          className={styles.editLink}
        >
          Edit
        </Link>
      </div>

      <hr className={styles.divider} />
      <div className={styles.kv}><b>Venue:</b> {wedding.venue}</div>
      <div className={styles.kv}><b>Contact Person:</b> {wedding.contactPersonGroomSide} ({wedding.mobileGroomSide})</div>
    </div>
  );
}
