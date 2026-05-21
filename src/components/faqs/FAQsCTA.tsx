'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { ReorderProps, useDisclosure, useReorderFAQMutation } from '@/hooks';
import { FAQ } from '@/api';

import { Button } from '../Button';
import { FAQFormModal } from './FAQFormModal';

export const FAQsCTA = ({ items, commit, isLoading, isReordered, reset, setIsLoading }: ReorderProps<FAQ>) => {
  const modalDisclosure = useDisclosure();

  const reorderMutation = useReorderFAQMutation();

  const onReorder = () => {
    if (!items) return;

    setIsLoading(true);

    reorderMutation.mutate(
      items.map((f) => f.id),
      {
        onSuccess: (data) => {
          commit(data);

          toast.success('FAQs reordered successfully.');
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

      <div>
        <Button icon={<HugeiconsIcon icon={Plus} />} onClick={modalDisclosure.onOpen}>
          Add FAQ
        </Button>

        <FAQFormModal disclosure={modalDisclosure} />
      </div>
    </div>
  );
};
