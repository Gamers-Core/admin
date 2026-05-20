'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { TopBarCTA } from '@/components';
import { useReorder, useUserReviewsQuery } from '@/hooks';

import { UserReviewCard } from './UserReviewCard';
import { UserReviewsCTA } from './UserReviewsCTA';

export const UserReviewsList = () => {
  const userReviewsQuery = useUserReviewsQuery();

  const { dndId, onDragEnd, sensors, state } = useReorder({ items: userReviewsQuery.data ?? [] });

  return (
    <>
      <TopBarCTA>
        <UserReviewsCTA {...state} />
      </TopBarCTA>

      <section className="flex-1 flex flex-col gap-8 min-w-0">
        {state.items?.length ? (
          <div className="flex flex-col gap-6">
            <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext
                disabled={state.isLoading}
                items={state.items.map((_, index) => index)}
                strategy={verticalListSortingStrategy}
              >
                {state.items?.map((userReview, index) => (
                  <UserReviewCard key={userReview.id} isDisabled={state.isLoading} index={index} {...userReview} />
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
    </>
  );
};
