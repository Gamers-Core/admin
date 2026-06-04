import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { SearchUsersSchema } from '@/api';
import { useUsersQuery } from '@/hooks';
import { Searchbar, UsersCTA, UsersList } from '@/components';
import { PagePropsWithSearchParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Users' };

export default async function Users(props: PagePropsWithSearchParams<SearchUsersSchema>) {
  const searchParams = await props.searchParams;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: useUsersQuery.queryKey(searchParams),
      queryFn: useUsersQuery.queryFn,
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
