'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function WeddingDashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Track viewport for mobile-only drawer
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Ensure drawer closes when switching to desktop/tablet
  useEffect(() => { if (!isMobile && drawerOpen) setDrawerOpen(false); }, [isMobile, drawerOpen]);

  // Lock body scroll when drawer is open on mobile
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
      <main style={{ marginLeft: isMobile ? 0 : 'var(--sidebar-w)', marginTop: 'var(--header-h)', flex: 1, padding: '24px 16px 24px 16px' }} aria-hidden={isMobile && drawerOpen}>
        {children}
      </main>
      <style jsx>{`
        @media (max-width: 1024px) {
          main { margin-left: 0; padding: 16px 12px 24px 12px; }
        }
      `}</style>
    </div>
  );
}
