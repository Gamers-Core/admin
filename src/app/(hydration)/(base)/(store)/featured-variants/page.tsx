import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useFeaturedVariantsQuery, useProductsQuery } from '@/hooks';
import { FeaturedVariantsList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Featured Variants' };

export default async function FeaturedVariants() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useFeaturedVariantsQuery),
    queryClient.prefetchQuery({ queryKey: useProductsQuery.queryKey(), queryFn: useProductsQuery.queryFn }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeaturedVariantsList />
    </HydrationBoundary>
  );
}
