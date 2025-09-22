'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './DashboardSidebar.module.css';
import { IoChevronForward } from 'react-icons/io5';

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

// Ensure the very first character is uppercase regardless of source casing
const capitalizeFirst = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export default function DashboardSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [weddingSections, setWeddingSections] = useState<any[]>([]);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const safePathname = pathname ?? '';

  // Determine if user is inside a submenu of any main menu
  const submenuHostItem = menuItems.find((item) => safePathname.startsWith(item.path + '/'));
  const visibleMenuItems = submenuHostItem ? [submenuHostItem] : menuItems;

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

  const handleNavigate = (href: string) => {
    router.push(href);
    // Close the drawer on mobile when navigating
    onClose?.();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div className={`${styles.backdrop} ${open ? styles.backdropShow : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <Link className={styles.titleLink} href="/dashboard">
          Dashboard
        </Link>
        <nav>
          <ul className={styles.menuRoot}>
            {visibleMenuItems.map((item) => (
              <li key={item.path} className={styles.menuItem}>
                <Link
                  href={item.path}
                  className={`${styles.menuLink} ${safePathname.startsWith(item.path) ? styles.menuLinkActive : ''}`}
                >
                  {item.label}
                  {/* Chevron is inside the link so it stays aligned with the main row */}
                  <IoChevronForward className={styles.menuChevron} size={19} />
                </Link>
                {/* Wedding sections as sub-menu */}
                {item.path === '/dashboard/wedding-management' && weddingId && safePathname.startsWith(`/dashboard/wedding-management/${weddingId}`) && (
                  <ul className={styles.subMenu}>
                    {/* Wedding Info always at the top */}
                    <li key="info" className={styles.subMenuItem}>
                      <a
                        className={`${styles.subMenuLink} ${activeSection === 'info' ? styles.subMenuLinkActive : ''}`}
                        onClick={() => handleNavigate(`/dashboard/wedding-management/${weddingId}/info`)}
                      >
                        Wedding Info
                      </a>
                    </li>
                    {/* Vendor Master Sheet always second */}
                    <li key="vendorMasterSheet" className={styles.subMenuItem}>
                      <a
                        className={`${styles.subMenuLink} ${activeSection === 'vendorMasterSheet' ? styles.subMenuLinkActive : ''}`}
                        onClick={() => handleNavigate(`/dashboard/wedding-management/${weddingId}/vendorMasterSheet`)}
                      >
                        Vendor Master Sheet
                      </a>
                    </li>
                    {/* Render other dynamic sections (any order) */}
                    {otherSections.map((section: any) => (
                      <li key={section.key} className={styles.subMenuItem}>
                        <a
                          className={`${styles.subMenuLink} ${activeSection === section.key ? styles.subMenuLinkActive : ''}`}
                          onClick={() => handleNavigate(`/dashboard/wedding-management/${weddingId}/${section.key}`)}
                        >
                          {capitalizeFirst(String(section.label || ''))}
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
    </>
  );
}
