// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

import VendorMasterSheet from './VendorMasterSheet';

export default function VendorMasterSheetPage({ params }: { params: Promise<{ id: string }> }) {
  return <VendorMasterSheet params={params} />;
}
