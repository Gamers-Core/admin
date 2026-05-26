import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useCategoriesQuery } from '@/hooks';
import { CategoriesCTA, CategoriesList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | Categories' };

export default async function Categories() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useCategoriesQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesCTA />

      <CategoriesList />
    </HydrationBoundary>
  );
}
