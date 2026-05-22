import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { ProductsList, Searchbar, StatusFilter } from '@/components';
import { useProductsQuery } from '@/hooks';
import { SearchProductSchema } from '@/api';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Products' };

export default async function Products(props: PagePropsWithSearchParams<SearchProductSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: useProductsQuery.queryKey(searchParams),
      queryFn: useProductsQuery.queryFn,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex gap-2">
        <StatusFilter value={searchParams.status} />

        <Searchbar q={searchParams.q} />
      </div>

      <ProductsList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
