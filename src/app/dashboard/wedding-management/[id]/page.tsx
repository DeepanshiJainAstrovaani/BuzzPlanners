'use client';

import { redirect } from 'next/navigation';

export default function WeddingDashboardRedirect({ params }: { params: { id: string } }) {
  redirect(`/dashboard/wedding-management/${params.id}/info`);
}
