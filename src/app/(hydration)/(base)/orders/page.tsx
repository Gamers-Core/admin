import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { SearchOrderSchema } from '@/api';
import { useOrdersQuery } from '@/hooks';
import { OrdersList, Searchbar } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Orders' };

export default async function Orders(props: PagePropsWithSearchParams<SearchOrderSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: useOrdersQuery.queryKey(searchParams),
      queryFn: useOrdersQuery.queryFn,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Searchbar q={searchParams.q} />

      <OrdersList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
