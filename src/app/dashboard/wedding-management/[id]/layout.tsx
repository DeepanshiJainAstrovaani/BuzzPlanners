import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function WeddingDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
        <DashboardHeader />
      </div>
      <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 99 }}>
        <DashboardSidebar />
      </div>
      <main style={{ marginLeft: 240, marginTop: 72, flex: 1, padding: '40px 48px 0 48px' }}>
        {children}
      </main>
    </div>
  );
}
