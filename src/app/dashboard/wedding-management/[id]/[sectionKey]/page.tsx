import SectionTableEditor from '@/components/SectionTableEditor';
import WeddingInfoCard from '@/components/WeddingInfoCard';
import WeddingInfoStats from '@/components/WeddingInfoStats';
import { notFound } from 'next/navigation';

async function fetchWedding(id: string) {
  // Always use relative URL for server components
  const res = await fetch(`/api/weddings/${id}`, { cache: 'no-store' });
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

  // All non-info sections use the reusable table editor
  // Render as a Client Component wrapper
  return <SectionTableEditor weddingMongoId={params.id} sectionKey={params.sectionKey} />;
}
