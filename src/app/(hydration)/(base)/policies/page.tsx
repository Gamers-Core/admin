import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { usePoliciesQuery } from '@/hooks';
import { PoliciesList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Policies' };

export default async function Policies() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(usePoliciesQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PoliciesList />
    </HydrationBoundary>
  );
}
