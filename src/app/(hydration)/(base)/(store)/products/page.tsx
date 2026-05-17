import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { ProductsList, Searchbar } from '@/components';
import { useProductsQuery } from '@/hooks';
import { SearchSchema } from '@/api';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Products' };

export default async function Products(props: PagePropsWithSearchParams<SearchSchema>) {
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
      <Searchbar q={searchParams.q} />

      <ProductsList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
