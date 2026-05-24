import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useBrandsQuery } from '@/hooks';
import { BrandsCTA, BrandsList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Brands' };

export default async function Brands() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useBrandsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandsCTA />

      <BrandsList />
    </HydrationBoundary>
  );
}
