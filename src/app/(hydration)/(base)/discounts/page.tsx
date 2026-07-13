import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { SearchDiscountSchema } from '@/api';
import { useDiscountsQuery } from '@/hooks';
import { DiscountsCTA, DiscountsList, Searchbar } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Discounts' };

export default async function Discounts(props: PagePropsWithSearchParams<SearchDiscountSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: useDiscountsQuery.queryKey(searchParams),
      queryFn: useDiscountsQuery.queryFn,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiscountsCTA />

      <Searchbar q={searchParams.q} placeholder="Search for discounts..." />

      <DiscountsList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
