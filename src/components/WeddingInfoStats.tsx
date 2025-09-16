import React from 'react';

export default function WeddingInfoStats({ stats }: { stats: { cost: number, pending: number, guest: number } }) {
  return (
    <div style={{ display: 'flex', gap: 30 }} className='row col-md-12'>
      <div style={{ background: '#d9f3fc', borderRadius: 16, padding: 35, minWidth: '31rem', textAlign: 'center' }} className='col-md-3'>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>₹{stats.cost.toLocaleString('en-IN')}</div>
        <div style={{ fontWeight: 500, color: '#222' }}>Wedding Cost</div>
      </div>
      <div style={{ background: '#d9f3fc', borderRadius: 16, padding: 35, minWidth: '31rem', textAlign: 'center' }} className='col-md-3'>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>₹{stats.pending.toLocaleString('en-IN')}</div>
        <div style={{ fontWeight: 500, color: '#222' }}>Pending</div>
      </div>
      <div style={{ background: '#d9f3fc', borderRadius: 16, padding: 35, minWidth: '31rem', textAlign: 'center' }} className='col-md-3'>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{stats.guest.toLocaleString('en-IN')}</div>
        <div style={{ fontWeight: 500, color: '#222' }}>Guest</div>
      </div>
    </div>
  );
}
