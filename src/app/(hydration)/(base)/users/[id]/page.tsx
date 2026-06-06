import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { useUserQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';
import { UserAddresses, UserCTA, UserInfo, UserOrders } from '@/components';

export async function generateMetadata(props: PagePropsWithParams<{ id: string }>): Promise<Metadata> {
  const { id } = await props.params;
  const userId = Number(id);
  if (!Number.isFinite(userId)) return notFound();

  return { title: `Gamers Core | Users | ${userId}` };
}

export default async function UserDetails(props: PagePropsWithParams<{ id: string }>) {
  const { id } = await props.params;
  const userId = Number(id);
  if (!Number.isFinite(userId)) return notFound();

  const queryClient = new QueryClient();

  const [user] = await Promise.allSettled([
    queryClient.fetchQuery({
      queryKey: useUserQuery.queryKey(userId),
      queryFn: useUserQuery.queryFn,
    }),
  ]);

  if (user.status === 'rejected') return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserCTA userId={userId} />

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="min-w-0 flex-2 flex flex-col gap-6">
          <UserOrders userId={userId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
