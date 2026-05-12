import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useFAQsQuery } from '@/hooks';
import { FAQsList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | FAQs' };

export default async function FAQs() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useFAQsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FAQsList />
    </HydrationBoundary>
  );
}
