import { notFound } from 'next/navigation';
import WeddingInfoCard from '@/components/WeddingInfoCard';
import WeddingInfoStats from '@/components/WeddingInfoStats';

async function fetchWedding(id: string) {
  // Always use relative URL for server components
  const res = await fetch(`http://localhost:3000/api/weddings/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function WeddingSectionPage({ params }: { params: any }) {
  params = await params;
  if (!params.sectionKey) return notFound();

  if (params.sectionKey === 'info') {
    const wedding = await fetchWedding(params.id);
    if (!wedding) return notFound();
    // Demo stats, replace with real fields if available
    const stats = {
      cost: wedding.cost || 6000000,
      pending: wedding.pending || 58000,
      guest: wedding.guest || 2450,
    };
    return (
      <div>
        <WeddingInfoCard wedding={wedding} />
        <WeddingInfoStats stats={stats} />
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, minHeight: 400 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>
        {params.sectionKey === 'vendor-master-sheet' ? 'Vendor Master Sheet' : params.sectionKey.replace(/-/g, ' ')}
      </h2>
      <div>
        Section content for <b>{params.sectionKey}</b> goes here.
      </div>
    </div>
  );
}
