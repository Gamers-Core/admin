'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEffect, useId } from 'react';

import { useCTA, useUserReviewsQuery } from '@/hooks';
import { useUserReviewsReorderStore } from '@/stores';

import { UserReviewCard } from './UserReviewCard';
import { UserReviewsCTA } from './UserReviewsCTA';

export const UserReviewsList = () => {
  useCTA(UserReviewsCTA);

  const userReviewsQuery = useUserReviewsQuery();

  const userReviews = useUserReviewsReorderStore((state) => state.items) ?? userReviewsQuery.data ?? [];
  const isLoading = useUserReviewsReorderStore((state) => state.isLoading);
  const setUserReviews = useUserReviewsReorderStore((state) => state.setItems);
  const setQueryUserReviews = useUserReviewsReorderStore((state) => state.setQueryItems);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const dndId = useId();

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = userReviews.findIndex((f) => f.id === active.id);
    const newIndex = userReviews.findIndex((f) => f.id === over.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    setUserReviews(arrayMove(userReviews, oldIndex, newIndex));
  };

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
