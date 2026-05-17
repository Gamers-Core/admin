import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { ProductsList } from '@/components';
import { useProductsQuery } from '@/hooks';

export const metadata: Metadata = { title: 'Gamers Core | Products' };

export default async function Products() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useProductsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsList />
    </HydrationBoundary>
  );
}
