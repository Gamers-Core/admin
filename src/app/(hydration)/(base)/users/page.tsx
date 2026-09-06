import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { SearchUsersSchema } from '@/api';
import { useUsersInfiniteQuery } from '@/hooks';
import { Searchbar, UsersCTA, UsersList } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Users' };

export default async function Users(props: PagePropsWithSearchParams<SearchUsersSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: useUsersInfiniteQuery.queryKey(searchParams),
      queryFn: useUsersInfiniteQuery.queryFn,
      initialPageParam: 1,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersCTA />

      <Searchbar q={searchParams.q} />

      <UsersList searchParams={searchParams} />
    </HydrationBoundary>
  );
}
