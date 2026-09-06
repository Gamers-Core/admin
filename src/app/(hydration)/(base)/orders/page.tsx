import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { SearchOrderSchema } from '@/api';
import { useOrdersInfiniteQuery } from '@/hooks';
import { OrdersCTA, OrdersList, Searchbar } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Orders' };

export default async function Orders(props: PagePropsWithSearchParams<SearchOrderSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: useOrdersInfiniteQuery.queryKey(searchParams),
      queryFn: useOrdersInfiniteQuery.queryFn,
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersCTA />

      <Searchbar q={searchParams.q} />

      <OrdersList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
