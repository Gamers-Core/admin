'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { ReorderProps, useDisclosure, useReorderUserReviewMutation } from '@/hooks';
import { UserReview } from '@/api';

import { Button } from '../Button';
import { UserReviewFormModal } from './UserReviewFormModal';
import { TopBarCTA } from '../sidebar';

export const UserReviewsCTA = ({
  items,
  isLoading,
  isReordered,
  reset,
  setIsLoading,
  commit,
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
          commit(data);

          toast.success('User reviews reordered successfully.');
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <TopBarCTA className="flex gap-2">
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
    </TopBarCTA>
  );
};
