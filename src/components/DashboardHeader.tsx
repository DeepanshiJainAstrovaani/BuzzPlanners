import Image from 'next/image';
import styles from './Header.module.css';

export default function DashboardHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Image src="/buzzplannersLogo.png" alt="Buzz Planners" width={120} height={120} />
      </div>
      <button className={styles.logout}>Logout</button>
    </header>
  );
}
