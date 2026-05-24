'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { ReorderProps, useDisclosure, useReorderFeaturedVariantMutation } from '@/hooks';
import { FeaturedVariant } from '@/api';

import { Button } from '../Button';
import { FeaturedVariantFormModal } from './FeaturedVariantFormModal';
import { TopBarCTA } from '../sidebar';

export const FeaturedVariantsCTA = ({
  items,
  commit,
  isLoading,
  isReordered,
  reset,
  setIsLoading,
}: ReorderProps<FeaturedVariant>) => {
  const modalDisclosure = useDisclosure();

  const reorderMutation = useReorderFeaturedVariantMutation();

  const onReorder = () => {
    if (!items) return;

    setIsLoading(true);

    reorderMutation.mutate(
      items.map((f) => f.id),
      {
        onSuccess: (data) => {
          commit(data);

          toast.success('Featured variants reordered successfully.');
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

      <div>
        <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
          Add
        </Button>

        <FeaturedVariantFormModal disclosure={modalDisclosure} />
      </div>
    </TopBarCTA>
  );
};
