import Link from 'next/link';
import styles from './Sidebar.module.css';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Wedding Management', path: '/dashboard/wedding-management' },
  { label: 'Booking Management', path: '/dashboard/booking-management' },
  { label: 'Itinerary Builder', path: '/dashboard/itinerary-builder' },
  { label: 'Voucher Management', path: '/dashboard/voucher-management' },
  { label: 'Hotels Management', path: '/dashboard/hotels-management' },
  { label: 'Vendor Management', path: '/dashboard/vendor-management' },
  { label: 'Customized Package', path: '/dashboard/customized-package' },
  { label: 'Site Management', path: '/dashboard/site-management' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>Your Dashboard</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                {item.label}{' '}
                <span style={{ fontWeight: 600 }}>&#8250;</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
