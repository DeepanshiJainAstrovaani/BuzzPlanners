import React from 'react';
import styles from './WeddingInfoStats.module.css';

export default function WeddingInfoStats({ stats }: { stats: { cost: number, pending: number, guest: number } }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.statCard}>
        <div className={styles.value}>₹{stats.cost.toLocaleString('en-IN')}</div>
        <div className={styles.label}>Wedding Cost</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.value}>₹{stats.pending.toLocaleString('en-IN')}</div>
        <div className={styles.label}>Pending</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.value}>{stats.guest.toLocaleString('en-IN')}</div>
        <div className={styles.label}>Guest</div>
      </div>
    </div>
  );
}
