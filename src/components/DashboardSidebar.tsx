'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
  { label: 'Wedding Management', path: '/dashboard/wedding-management' },
  { label: 'Booking Management', path: '/dashboard/booking-management' },
  { label: 'Itinerary Builder', path: '/dashboard/itinerary-builder' },
  { label: 'Voucher Management', path: '/dashboard/voucher-management' },
  { label: 'Hotels Management', path: '/dashboard/hotels-management' },
  { label: 'Vendor Management', path: '/dashboard/vendor-management' },
  { label: 'Customized Package', path: '/dashboard/customized-package' },
  { label: 'Site Management', path: '/dashboard/site-management' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [weddingSections, setWeddingSections] = useState<any[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const safePathname = pathname ?? '';

  useEffect(() => {
    // Detect if on a wedding dashboard route
    const match = safePathname.match(/\/dashboard\/wedding-management\/(\w+)/);
    if (match) {
      const id = match[1];
      setWeddingId(id);
      // Fetch wedding sections
      fetch(`/api/weddings/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.sections) setWeddingSections(data.sections);
        });
      // Detect section from hash or query
      const sectionMatch = safePathname.match(/\/dashboard\/wedding-management\/\w+\/([\w-]+)/);
      setActiveSection(sectionMatch ? sectionMatch[1] : null);
    } else {
      setWeddingId(null);
      setWeddingSections([]);
      setActiveSection(null);
    }
  }, [safePathname]);

  // Filter out Vendor Master Sheet from dynamic sections to avoid duplication
  const otherSections = weddingSections.filter((s: any) => {
    const key = String(s?.key || '').toLowerCase();
    const label = String(s?.label || '').toLowerCase();
    return key !== 'vendormastersheet' && label !== 'vendor master sheet';
  });

  return (
    <aside
      style={{
        width: 240,
        background: '#222222',
        color: '#fff',
        height: '100vh',
        padding: '24px 0',
        position: 'fixed',
        left: 0,
        top: 72,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 99,
      }}
    >
      <Link
        className='my-2'
        href="/dashboard"
        style={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          textAlign: 'center',
          letterSpacing: 0.5,
          color: pathname === '/dashboard' ? '#ffb300' : '#fff',
          textDecoration: 'none',
          display: 'block',
        }}
      >
        Dashboard
      </Link>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ margin: '8px 0', borderBottom: '1px solid white' }}>
              <Link
                href={item.path}
                style={{
                  color: safePathname.startsWith(item.path) ? '#ffb300' : '#fff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 32px',
                  borderRadius: 4,
                  fontWeight: safePathname.startsWith(item.path) ? 700 : 400,
                  background: safePathname.startsWith(item.path) ? '#292929' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {item.label}{' '}
                <span style={{ fontWeight: 600 }}>&#8250;</span>
              </Link>
              {/* Wedding sections as sub-menu */}
              {item.path === '/dashboard/wedding-management' && weddingId && safePathname.startsWith(`/dashboard/wedding-management/${weddingId}`) && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {/* Wedding Info always at the top */}
                  <li key="info">
                    <a
                      style={{
                        color: activeSection === 'info' ? '#222' : '#848a8e',
                        background: activeSection === 'info' ? '#fdf5d5' : 'transparent',
                        borderRadius: 4,
                        display: 'block',
                        padding: '8px 36px',
                        fontWeight: activeSection === 'info' ? 700 : 500,
                        cursor: 'pointer',
                        margin: '2px 0',
                      }}
                      onClick={() => router.push(`/dashboard/wedding-management/${weddingId}/info`)}
                    >
                      Wedding Info
                    </a>
                  </li>
                  {/* Vendor Master Sheet always second */}
                  <li key="vendorMasterSheet">
                    <a
                      style={{
                        color: activeSection === 'vendorMasterSheet' ? '#222' : '#848a8e',
                        background: activeSection === 'vendorMasterSheet' ? '#fdf5d5' : 'transparent',
                        borderRadius: 4,
                        display: 'block',
                        padding: '8px 36px',
                        fontWeight: activeSection === 'vendorMasterSheet' ? 700 : 500,
                        cursor: 'pointer',
                        margin: '2px 0',
                      }}
                      onClick={() => router.push(`/dashboard/wedding-management/${weddingId}/vendorMasterSheet`)}
                    >
                      Vendor Master Sheet
                    </a>
                  </li>
                  {/* Render other dynamic sections (any order) */}
                  {otherSections.map((section: any) => (
                    <li key={section.key}>
                      <a
                        style={{
                          color: activeSection === section.key ? '#222' : '#848a8e',
                          background: activeSection === section.key ? '#fdf5d5' : 'transparent',
                          borderRadius: 4,
                          display: 'block',
                          padding: '8px 36px',
                          fontWeight: activeSection === section.key ? 700 : 500,
                          cursor: 'pointer',
                          margin: '2px 0',
                        }}
                        onClick={() => router.push(`/dashboard/wedding-management/${weddingId}/${section.key}`)}
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
