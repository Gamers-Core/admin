'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { ReorderProps, useDisclosure, useReorderUserReviewMutation } from '@/hooks';

import { Button } from '../Button';
import { UserReviewFormModal } from './UserReviewFormModal';
import { UserReview } from '@/api';

export const UserReviewsCTA = ({
  items,
  isLoading,
  isReordered,
  reset,
  setIsLoading,
  setItems,
}: ReorderProps<UserReview>) => {
  const modalDisclosure = useDisclosure();

  const reorderMutation = useReorderUserReviewMutation();

  const onReorder = () => {
    if (!items) return;

    setIsLoading(true);

    reorderMutation.mutate(
      items.map((f) => f.id),
      {
        onSuccess: (data) => {
          setItems(data);

          toast.success('User reviews reordered successfully.');
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
            onClick={reset}
          />
        </div>
      )}

      {items && items.length < 3 && (
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
