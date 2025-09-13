'use client';


import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WeddingManagementPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7', padding: '40px 48px 0 48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: '2rem' }}>Wedding Management</h1>
        <div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#222',
              fontSize: '1rem',
              fontWeight: 500,
              marginRight: 24,
              cursor: 'pointer',
            }}
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#e57373',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onClick={() => router.push('/login')}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
        <div style={{ background: '#d6effa', borderRadius: 12, padding: '28px 36px', minWidth: 180, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>106</div>
          <div style={{ color: '#222', fontWeight: 500, fontSize: 18, marginTop: 4 }}>Weddings</div>
        </div>
        <div style={{ background: '#fdf5d5', borderRadius: 12, padding: '28px 36px', minWidth: 180, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>23</div>
          <div style={{ color: '#222', fontWeight: 500, fontSize: 18, marginTop: 4 }}>Upcoming</div>
        </div>
        <div style={{ background: '#fbe7d7', borderRadius: 12, padding: '28px 36px', minWidth: 180, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>2.5 Lac</div>
          <div style={{ color: '#222', fontWeight: 500, fontSize: 18, marginTop: 4 }}>Guest</div>
        </div>
      </div>

      {/* Wedding List Section */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 32, maxWidth: 1100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Wedding List</h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <button style={{ border: '1px solid #222', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 18, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>🔎</span> Filter
            </button>
            <button style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '8px 32px', cursor: 'pointer' }}>
              Create
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search any wedding"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid #ccc',
              fontSize: 16,
              marginBottom: 8,
            }}
          />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#2196f3' }}>Id</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Title</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Wedding Date</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3].map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', color: '#2196f3', fontWeight: 700, cursor: 'pointer' }}>WED453</td>
                <td style={{ padding: '16px' }}>Jatin weds Roshni</td>
                <td style={{ padding: '16px' }}>25 Sep 2025</td>
                <td style={{ padding: '16px' }}>Upcoming</td>
                <td style={{ padding: '16px' }}>
                  <button style={{ border: '1px solid #2196f3', color: '#2196f3', background: '#fff', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 15, marginRight: 8, cursor: 'pointer' }}>View Details</button>
                  <span style={{ color: '#e57373', fontSize: 22, cursor: 'pointer', verticalAlign: 'middle', marginLeft: 15 }}>
                    <Image src="/icons/delete.png" alt="delete" width={25} height={25} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
