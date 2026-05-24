import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { useOrderQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';
import { OrderCTA, TopBarCTA } from '@/components';

type PageParams = PagePropsWithParams<{ orderNumber: string }>;

export async function generateMetadata(props: PageParams): Promise<Metadata> {
  const { orderNumber } = await props.params;
  if (!orderNumber) return notFound();

  return { title: `Gamers Core | Orders | ${orderNumber}` };
}

export default async function Order(props: PageParams) {
  const { orderNumber } = await props.params;
  if (!orderNumber) return notFound();

  const queryClient = new QueryClient();

  const [order] = await Promise.allSettled([
    queryClient.fetchQuery({ queryKey: useOrderQuery.queryKey(orderNumber), queryFn: useOrderQuery.queryFn }),
  ]);

  if (order.status === 'rejected') return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopBarCTA>
        <OrderCTA orderNumber={orderNumber} />
      </TopBarCTA>
    </HydrationBoundary>
  );
}
