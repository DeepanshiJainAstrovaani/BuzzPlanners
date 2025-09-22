import Image from 'next/image';
import styles from './Header.module.css';
import { IoPowerOutline } from 'react-icons/io5';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header style={{
          width: '100%',
          height: 'calc(var(--header-h) - 10px)',
          background: '#222222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100
        }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile menu button */}
        <button aria-label="Open menu" className={styles.menuButton} onClick={onMenuClick}>
          &#9776;
        </button>
        <Image src="/buzzplannersLogo.png" alt="Buzz Planners" width={76} height={38} />
      </div>
      <button className={styles.logout}>
        <IoPowerOutline size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
        Logout
      </button>
    </header>
  );
}