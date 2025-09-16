import Image from 'next/image';
import styles from './Header.module.css';

export default function DashboardHeader() {
  return (
    <header style={{
					width: '100%',
					background: '#222222',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0.8rem 2rem',
					position: 'fixed',
					top: 0,
					left: 0,
					zIndex: 100,
					borderBottom: '1px solid white',
				}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Image src="/buzzplannersLogo.png" alt="Buzz Planners" width={120} height={60} />
      </div>
      <button className={styles.logout}>Logout</button>
    </header>
  );
}