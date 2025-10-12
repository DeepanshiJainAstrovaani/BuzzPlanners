// Generate static params for static export
export async function generateStaticParams() {
  // Return a list of possible IDs for static generation
  // You can expand this list based on your actual travel packages
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

import TravelPackageDetail from './TravelPackageDetail';

export default function TravelPackagePage({ params }: { params: Promise<{ id: string }> }) {
  return <TravelPackageDetail params={params} />;
}
