'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingManagementPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track viewport for mobile drawer
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Ensure drawer closes when switching to desktop
  useEffect(() => { if (!isMobile && drawerOpen) setDrawerOpen(false); }, [isMobile, drawerOpen]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isMobile && drawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, drawerOpen]);

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <DashboardHeader onMenuClick={() => { if (isMobile) setDrawerOpen(true); }} />
      <DashboardSidebar open={isMobile && drawerOpen} onClose={() => isMobile && setDrawerOpen(false)} />

      <main
        style={{
          marginLeft: isMobile ? 0 : 'var(--sidebar-w)',
          marginTop: 'var(--header-h)',
          flex: 1,
          background: '#f7f7f7',
          minHeight: 'calc(100vh - var(--header-h))',
          padding: '20px 20px 40px',
          width: '-webkit-fill-available',
          overflowX: 'hidden'
        }}
        aria-hidden={isMobile && drawerOpen}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
          <h1 style={{ fontWeight: 600, fontSize: '1.2rem', margin: 0 }}>Booking Dashboard</h1>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              style={{ fontSize: 12, fontWeight: 500, padding: '4px 14px' }}
              onClick={() => router.push('/dashboard/booking-management/pdf-design')}
            >
              PDF Design Preview
            </button>
          </div>
        </div>

        <section style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, padding: '28px 22px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Bookings Overview (Coming Soon)</h2>
          <p style={{ fontSize: 13, color: '#555', margin: 0 }}>
            This area will show booking metrics, recent activity, and management tools.
          </p>
        </section>
      </main>

      <style jsx>{`
        @media (max-width: 1024px) {
          main { margin-left: 0 !important; padding: 16px 14px 34px 14px !important; }
        }
      `}</style>
    </div>
  );
}
