'use client';

import { ReorderList } from '@/components';
import { useUserReviewsQuery } from '@/hooks';

import { UserReviewCard } from './UserReviewCard';
import { UserReviewsCTA } from './UserReviewsCTA';

export const UserReviewsList = () => {
  const userReviewsQuery = useUserReviewsQuery();

  return (
    <ReorderList
      items={userReviewsQuery.data}
      renderEmpty={() => (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no user reviews to display.
        </p>
      )}
      renderContainer={(children) => <div className="flex flex-col gap-6">{children}</div>}
      renderItem={(userReview, sortable, _index, state) => (
        <UserReviewCard key={userReview.id} sortable={sortable} isDisabled={state.isLoading} {...userReview} />
      )}
    >
      {(children, state) => (
        <>
          <UserReviewsCTA {...state} />

          <section className="flex-1 flex flex-col gap-8 min-w-0">{children}</section>
        </>
      )}
    </ReorderList>
  );
};
