'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WeddingManagementPage() {
  const router = useRouter();
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; wedding?: any }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  const fetchWeddings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weddings');
      const data = await res.json();
      console.log('[WeddingList] GET /api/weddings ->', Array.isArray(data) ? data.map((w: any) => ({ _id: w._id, weddingId: w.weddingId, title: w.title })) : data);
      setWeddings(data);
    } catch (err) {
      console.error('[WeddingList] Failed to fetch weddings:', err);
      setWeddings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.wedding) return;
    setDeleting(true);
    try {
      console.log('[WeddingList] Deleting wedding _id:', deleteModal.wedding._id);
      await fetch(`/api/weddings/${deleteModal.wedding._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      setDeleteModal({ open: false });
      fetchWeddings();
    } catch (err) {
      console.error('[WeddingList] Failed to delete wedding:', err);
      alert('Failed to delete wedding.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      {deleteModal.open && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
              <span style={{ fontSize: 64, color: '#e53935', marginBottom: 12, lineHeight: 1 }}>
                <Image src="/icons/delete.png" alt="delete" width={50} height={50} />
              </span>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#e53935', marginBottom: 0, textAlign: 'center' }}>
                Delete {deleteModal.wedding?.title} <span style={{ color: '#2196f3', marginLeft: 6 }}>({deleteModal.wedding?._id})</span>
              </div>
            </div>
            {/* Body */}
            <div style={{ fontWeight: 600, fontSize: 18, margin: '24px 0 8px 0', color: '#222', textAlign: 'center' }}>
              Are you sure?
            </div>
            {/* Footer */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
              <button onClick={handleDelete} disabled={deleting} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
              <button onClick={() => setDeleteModal({ open: false })} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Fixed Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
        <DashboardHeader />
      </div>
      {/* Fixed Sidebar */}
      <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 99 }}>
        <DashboardSidebar />
      </div>
      {/* Main Content */}
      <main style={{ marginLeft: 240, marginTop: 72, flex: 1, padding: '40px 48px 0 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontWeight: 700, fontSize: '2rem' }}>Wedding Management</h1>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
          <div style={{ background: '#d6effa', borderRadius: 12, padding: '28px 36px', minWidth: '25rem', boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>106</div>
            <div style={{ color: '#222', fontWeight: 500, fontSize: 25, marginTop: 4 }}>Weddings</div>
          </div>
          <div style={{ background: '#fdf5d5', borderRadius: 12, padding: '28px 36px', minWidth: '25rem', boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>23</div>
            <div style={{ color: '#222', fontWeight: 500, fontSize: 25, marginTop: 4 }}>Upcoming</div>
          </div>
          <div style={{ background: '#fbe7d7', borderRadius: 12, padding: '28px 36px', minWidth: '25rem', boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#222' }}>2.5 Lac</div>
            <div style={{ color: '#222', fontWeight: 500, fontSize: 25, marginTop: 4 }}>Guest</div>
          </div>
        </div>

        {/* Wedding List Section */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 32, width: '100%' }} className='col-md-12'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, margin: 0 }}>Wedding List</h2>
            <div style={{ display: 'flex', gap: 16 }}>
              <button style={{ border: '1px solid #222', borderRadius: 8, background: '#fff', fontWeight: 600, fontSize: 18, padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ fontSize: 18 }}> ↓↑ </span> Filter
              </button>
                <button
                style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '8px 32px', cursor: 'pointer' }}
                onClick={() => router.push('/dashboard/wedding-management/create')}
                >
                Create
                </button>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="🔍︎   Search any Wedding"
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
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Id</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Title</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Wedding Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
              ) : weddings.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>No weddings found.</td></tr>
              ) : (
                weddings.map((wedding, i) => (
                  <tr key={wedding._id || i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px', color: '#2196f3', fontWeight: 700, cursor: 'pointer' }}>{wedding.weddingId}</td>
                    <td style={{ padding: '16px' }}>{wedding.title}</td>
                    <td style={{ padding: '16px' }}>{wedding.date}</td>
                    <td style={{ padding: '16px' }}>{wedding.status}</td>
                    <td style={{ padding: '16px' }}>
                      <button
                        style={{ border: '1px solid #2196f3', color: '#2196f3', background: '#fff', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 15, marginRight: 8, cursor: 'pointer' }}
                        onClick={() => router.push(`/dashboard/wedding-management/${wedding._id}`)}
                      >
                        View Details
                      </button>
                      <span style={{ color: '#e57373', fontSize: 22, cursor: 'pointer', verticalAlign: 'middle', marginLeft: 15 }}
                        onClick={() => setDeleteModal({ open: true, wedding })}>
                        <Image src="/icons/delete.png" alt="delete" width={25} height={25} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 0.3s',
};

const modalStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: '40px 48px',
  boxShadow: '0 4px 32px #0002',
  textAlign: 'center' as const,
  minWidth: 320,
  animation: 'popIn 0.3s',
};
