'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect } from 'react';

import { useCTA, useReorder, useUserReviewsQuery } from '@/hooks';
import { useUserReviewsReorderStore } from '@/stores';

import { UserReviewCard } from './UserReviewCard';
import { UserReviewsCTA } from './UserReviewsCTA';

export const UserReviewsList = () => {
  useCTA(UserReviewsCTA);

  const userReviewsQuery = useUserReviewsQuery();

  const userReviews = useUserReviewsReorderStore((state) => state.items) ?? userReviewsQuery.data ?? [];
  const isLoading = useUserReviewsReorderStore((state) => state.isLoading);
  const setQueryUserReviews = useUserReviewsReorderStore((state) => state.setQueryItems);

  const { dndId, onDragEnd, sensors } = useReorder(useUserReviewsReorderStore);

  useEffect(() => {
    if (!userReviewsQuery.data) return;

    setQueryUserReviews(userReviewsQuery.data);
  }, [userReviewsQuery.data, setQueryUserReviews]);

  return (
    <section className="flex-1 flex flex-col gap-8 min-w-0">
      {userReviews.length ? (
        <div className="flex flex-col gap-6">
          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              disabled={isLoading}
              items={userReviews.map(({ id }) => id)}
              strategy={verticalListSortingStrategy}
            >
              {userReviews.map((userReview) => (
                <UserReviewCard key={userReview.id} isDisabled={isLoading} {...userReview} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no user reviews to display.
        </p>
      )}
    </section>
  );
};
