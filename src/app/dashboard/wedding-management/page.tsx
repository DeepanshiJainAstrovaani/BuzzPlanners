'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
// Removed unused Image import and added Ionicons to match main dashboard styling
import { IoChevronForward, IoTrashOutline, IoFunnelOutline, IoEyeOutline } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

export default function WeddingManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; wedding?: any }>({ open: false });
  const [deleting, setDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Phone breakpoint for compact icon-only actions
  const [isPhone, setIsPhone] = useState(false);
  // Search text for client-side filtering
  const [searchText, setSearchText] = useState('');

  // Track viewport for mobile-only drawer
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track phone width (≤576px) to swap View button with eye icon
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 576px)');
    const onChange = () => setIsPhone(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    // Safari fallback
    mql.addListener?.(onChange as any);
    return () => {
      mql.removeEventListener?.('change', onChange);
      mql.removeListener?.(onChange as any);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Ensure drawer closes when switching to desktop/tablet
  useEffect(() => { if (!isMobile && drawerOpen) setDrawerOpen(false); }, [isMobile, drawerOpen]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isMobile && drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, drawerOpen]);

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

  // Memoized filtered list based on the search text
  const filteredWeddings = useMemo(() => {
    if (!searchText.trim()) return weddings;
    const tokens = searchText.toLowerCase().split(/\s+/).filter(Boolean);
    return weddings.filter((w: any) => {
      const hay = `${w?.weddingId ?? ''} ${w?.title ?? ''} ${w?.date ?? ''} ${w?.status ?? ''}`.toLowerCase();
      return tokens.every(t => hay.includes(t));
    });
  }, [weddings, searchText]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      {deleteModal.open && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
              <span style={{ fontSize: 28, color: '#e53935', marginBottom: 6, lineHeight: 1 }}>
                <IoTrashOutline size={24} />
              </span>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#e53935', marginBottom: 0, textAlign: 'center' }}>
                Delete {deleteModal.wedding?.title} <span style={{ color: '#2196f3', marginLeft: 6 }}>({deleteModal.wedding?._id})</span>
              </div>
            </div>
            {/* Body */}
            <div style={{ fontWeight: 500, fontSize: 13, margin: '12px 0 6px 0', color: '#222', textAlign: 'center' }}>
              Are you sure?
            </div>
            {/* Footer */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
              <button onClick={handleDelete} disabled={deleting} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
              <button onClick={() => setDeleteModal({ open: false })} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, padding: '7px 14px', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Sidebar (both fixed by their own components) */}
      <DashboardHeader onMenuClick={() => { if (isMobile) setDrawerOpen(true); }} />
      <DashboardSidebar open={isMobile && drawerOpen} onClose={() => isMobile && setDrawerOpen(false)} />

      {/* Main Content */}
      <main
        className="container-fluid"
        style={{
          marginLeft: isMobile ? 0 : 'var(--sidebar-w)',
          marginTop: 'var(--header-h)',
          flex: 1,
          background: '#f7f7f7',
          overflowX: 'hidden',
          width: '-webkit-fill-available',
        }}
        aria-hidden={isMobile && drawerOpen}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3 gap-2 mt-2 flex-wrap">
          <h1 className="m-0" style={{ fontWeight: 600, fontSize: '1.2rem' }}>Wedding Management</h1>
          
        </div>

        {/* Cards - match main dashboard sizing and arrow placement */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4 col-md-4 col-lg-4">
            <div style={{ background: '#d6effa', padding: '18px 20px' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>106</div>
              <div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <span>Weddings</span>
                <IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '1rem' }} />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4 col-md-4 col-lg-4">
            <div style={{ background: '#fdf5d5', padding: '18px 20px' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>23</div>
              <div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <span>Upcoming</span>
                <IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '1rem' }} />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4 col-md-4 col-lg-4">
            <div style={{ background: '#fbe7d7', padding: '18px 20px' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>2.5 Lac</div>
              <div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <span>Guest</span>
                <IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '1rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Wedding List Section */}
        <div className='bg-white p-3 p-md-4'>
          <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
            <h2 className="m-0" style={{ fontWeight: 600, fontSize: 16 }}>Wedding List</h2>
            <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '13px',
                fontWeight: 400,
                padding: '1px 20px' }}>
                <span style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6 }}>
                  <IoFunnelOutline />
                </span>
                Filter
                </button>
              <button className="btn btn-success create-btn" onClick={() => router.push('/dashboard/wedding-management/create')} style={{
                fontSize: '13px',
                fontWeight: 400,
                padding: '1px 20px',
              }}>Create</button>
            </div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="🔎︎   Search any Wedding"
              className="form-control"
              style={{ fontSize: 12, padding: '10px 12px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search weddings"
            />
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}>Id</th>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}>Title</th>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}>Wedding Date</th>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}>Status</th>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}>Action</th>
                  <th style={{ background: '#EBE9E9', fontSize: '14px' }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
                ) : filteredWeddings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No matching weddings found.</td></tr>
                ) : (
                  filteredWeddings.map((wedding, i) => (
                    <tr key={wedding._id || i}>
                      <td className="py-3" style={{ color: '#2196f3', fontWeight: 500, cursor: 'pointer', fontSize: '12px' }}>{wedding.weddingId}</td>
                      <td className="py-3" style={{ fontSize: '12px' }}>{wedding.title}</td>
                      <td className="py-3" style={{ fontSize: '12px' }}>{wedding.date}</td>
                      <td className="py-3" style={{ fontSize: '12px' }}>{wedding.status}</td>
                      <td className="py-3">
                        <div className="action-cell">
                          {isPhone ? (
                            <button
                              type="button"
                              className="icon-btn view-icon-btn"
                              aria-label="View details"
                              onClick={() => router.push(`/dashboard/wedding-management/${wedding._id}/info`)}
                            >
                              <IoEyeOutline size={18} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm view-btn"
                              style={{ fontSize: '13px' }}
                              onClick={() => router.push(`/dashboard/wedding-management/${wedding._id}/info`)}
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </td>
                      <td className='py-3'>
                        <button
                            type="button"
                            className="icon-btn delete-btn"
                            aria-label="Delete wedding"
                            onClick={() => setDeleteModal({ open: true, wedding })}
                          >
                            <IoTrashOutline size={18} />
                          </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <style jsx>{`
        .action-cell { display: inline-flex; align-items: center; gap: 10px; }
        .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #e57373; cursor: pointer; transition: all .2s ease; }
        .icon-btn:hover { background: #fdecec; color: #d9534f; border-color: #f5c6c6; }
        .icon-btn:focus-visible { outline: 2px solid rgba(217,83,79,.45); outline-offset: 2px; }
        /* Eye icon (View) on phones: black */
        .view-icon-btn { color: #000; }
        .view-icon-btn:hover { background: #f2f2f2; color: #000; border-color: #d0d0d0; }
        .create-btn { background: #2BB96B; border-color: #2BB96B; transition: all .2s ease; }
        .create-btn:hover { background: #23a95f; border-color: #23a95f; box-shadow: 0 4px 12px rgba(43,185,107,.35); transform: translateY(-1px); }
        .create-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(43,185,107,.25); }
        .create-btn:focus-visible { outline: 2px solid #1e8c4a; outline-offset: 2px; }
        /* View Details button: invert colors on hover */
        .view-btn { background: #fff; color: #3698D9; border: var(--bs-border-width) solid #3698D9; transition: all .2s ease; }
        .view-btn:hover { background: #3698D9; color: #fff; border-color: #3698D9; }
        .view-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(54,152,217,.25); }
        .view-btn:focus-visible { outline: 2px solid rgba(54,152,217,.5); outline-offset: 2px; }
        /* Keep form control border unchanged on focus */
        .form-control:focus { border: var(--bs-border-width) solid var(--bs-border-color) !important; box-shadow: none; }
        @media (max-width: 1024px) {
          main { margin-left: 0; padding: 12px 12px 28px 12px; }
        }
        @media (max-width: 576px) {
          .action-cell { flex-direction: column; align-items: flex-start; gap: 6px; }
        }
      `}</style>
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
  padding: 12,
  animation: 'fadeIn 0.25s',
};

const modalStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: '12px',
  boxShadow: '0 4px 24px #0002',
  textAlign: 'center' as const,
  minWidth: 'min(20rem, 92vw)',
  animation: 'popIn 0.25s',
};
