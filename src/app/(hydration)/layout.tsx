import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { headers } from 'next/headers';

import { useMeQuery, useSidebarStatsQuery } from '@/hooks';
import { isLoggedInHeaderKey } from '@/proxy/const';
import { QueryProviders } from '@/components';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();

  const headersList = await headers();
  const isLoggedIn = headersList.get(isLoggedInHeaderKey) === 'true';

  if (isLoggedIn) await Promise.all([queryClient.prefetchQuery(useMeQuery)]);

  await Promise.allSettled([queryClient.prefetchQuery(useSidebarStatsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QueryProviders />

      {children}
    </HydrationBoundary>
  );
}
