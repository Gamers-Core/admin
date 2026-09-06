import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useFeaturedVariantsQuery, useProductsInfiniteQuery } from '@/hooks';
import { FeaturedVariantsList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Featured Variants' };

export default async function FeaturedVariants() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useFeaturedVariantsQuery),
    queryClient.prefetchInfiniteQuery({
      queryKey: useProductsInfiniteQuery.queryKey(),
      queryFn: useProductsInfiniteQuery.queryFn,
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeaturedVariantsList />
    </HydrationBoundary>
  );
}
