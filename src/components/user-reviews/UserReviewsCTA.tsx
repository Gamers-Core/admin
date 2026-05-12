'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { useDisclosure, useReorderUserReviewMutation } from '@/hooks';
import { useUserReviewsReorderStore } from '@/stores';

import { Button } from '../Button';
import { UserReviewFormModal } from './UserReviewFormModal';

export const UserReviewsCTA = () => {
  const modalDisclosure = useDisclosure();

  const reorderMutation = useReorderUserReviewMutation();

  const userReviews = useUserReviewsReorderStore((state) => state.items);
  const isLoading = useUserReviewsReorderStore((state) => state.isLoading);
  const isReordered = useUserReviewsReorderStore((state) => state.isReordered);
  const setUserReviews = useUserReviewsReorderStore((state) => state.setItems);
  const resetUserReviews = useUserReviewsReorderStore((state) => state.reset);
  const setIsLoading = useUserReviewsReorderStore((state) => state.setIsLoading);

  const onReorder = () => {
    if (!userReviews) return;

    setIsLoading(true);

    reorderMutation.mutate(
      userReviews.map((f) => f.id),
      {
        onSuccess: (data) => {
          setUserReviews(data);

          toast.success('UserReviews reordered successfully.');
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex gap-2">
      {isReordered && (
        <div className="flex gap-2">
          <Button
            variant="default"
            isLoading={isLoading}
            loadingIconClassName="size-4"
            icon={<HugeiconsIcon icon={Checkmark} />}
            onClick={onReorder}
          />

          <Button
            variant="destructive"
            isLoading={isLoading}
            loadingIconClassName="size-4"
            icon={<HugeiconsIcon icon={Refresh01FreeIcons} />}
            onClick={resetUserReviews}
          />
        </div>
      )}

      {(userReviews?.length || 0) < 3 && (
        <div>
          <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
            Add UserReview
          </Button>

          <UserReviewFormModal disclosure={modalDisclosure} />
        </div>
      )}
    </div>
  );
};
