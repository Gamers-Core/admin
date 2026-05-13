import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { useUserReviewsQuery } from '@/hooks';
import { UserReviewsList } from '@/components';

export const metadata: Metadata = { title: 'Gamers Core | User Reviews' };

export default async function UserReviews() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(useUserReviewsQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserReviewsList />
    </HydrationBoundary>
  );
}
