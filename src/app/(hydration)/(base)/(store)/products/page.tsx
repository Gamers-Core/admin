import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { ProductsCTA, ProductsList, Searchbar, StatusFilter } from '@/components';
import { useProductsInfiniteQuery } from '@/hooks';
import { productStatuses, SearchProductSchema } from '@/api';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Products' };

export default async function Products(props: PagePropsWithSearchParams<SearchProductSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: useProductsInfiniteQuery.queryKey(searchParams),
      queryFn: useProductsInfiniteQuery.queryFn,
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsCTA />

      <div className="flex gap-2">
        <StatusFilter value={searchParams.status} options={productStatuses} />

        <Searchbar q={searchParams.q} />
      </div>

      <ProductsList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
