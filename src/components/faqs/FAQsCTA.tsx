'use client';

import { Checkmark, Plus, Refresh01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

import { useDisclosure, useReorderFAQMutation } from '@/hooks';
import { useFAQsReorderStore } from '@/stores';

import { Button } from '../Button';
import { FAQFormModal } from './FAQFormModal';

export const FAQsCTA = () => {
  const modalDisclosure = useDisclosure();

  const reorderMutation = useReorderFAQMutation();

  const faqs = useFAQsReorderStore((state) => state.faqs);
  const isLoading = useFAQsReorderStore((state) => state.isLoading);
  const isReordered = useFAQsReorderStore((state) => state.isReordered);
  const setFAQs = useFAQsReorderStore((state) => state.setFAQs);
  const resetFAQs = useFAQsReorderStore((state) => state.reset);
  const setIsLoading = useFAQsReorderStore((state) => state.setIsLoading);

  const onReorder = () => {
    if (!faqs) return;

    setIsLoading(true);

    reorderMutation.mutate(
      faqs.map((f) => f.id),
      {
        onSuccess: (data) => {
          setFAQs(data);

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
            onClick={resetFAQs}
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
