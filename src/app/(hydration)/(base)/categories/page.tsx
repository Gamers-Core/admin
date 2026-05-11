import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useCategoriesQuery } from '@/hooks';
import { CategoriesList } from '@/components';

export const metadata: Metadata = {
  title: 'Gamers Core | Categories',
  description: 'Discover our wide range of categories at Gamers Core.',
};

export default async function Categories() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useCategoriesQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesList />
    </HydrationBoundary>
  );
}
