export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateStaticParams() {
  const ids = ['1', '2', '3'];
  const sectionKeys = ['info', 'vendors', 'timeline', 'budget'];
  
  return ids.flatMap(id => 
    sectionKeys.map(sectionKey => ({
      id,
      sectionKey
    }))
  );
}

import SectionTableEditor from '@/components/SectionTableEditor';
import WeddingInfoCard from '@/components/WeddingInfoCard';
import WeddingInfoStats from '@/components/WeddingInfoStats';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

function normalizeBase(url: string) {
  if (!url) return '';
  const trimmed = url.replace(/\/$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

async function getBaseUrl() {
  // Prefer environment variables first (works on Vercel)
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL; // note: on Vercel this is hostname only
  if (fromEnv) return normalizeBase(fromEnv);

  // Fallback to request headers at runtime
  try {
    const hdrs = await headers();
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host');
    if (host) return `${proto}://${host}`;
  } catch {
    // ignore
  }

  // Final fallback for local dev
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return '';
}

async function fetchWedding(id: string) {
  const base = await getBaseUrl();
  if (!base) throw new Error('Base URL could not be resolved for server-side fetch');
  const url = new URL(`/api/weddings/${id}`, base);
  const res = await fetch(url.toString(), { cache: 'no-store', next: { revalidate: 0 } });
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
