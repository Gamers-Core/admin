'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect } from 'react';

import { useCTA, useFAQsQuery, useReorder } from '@/hooks';
import { useFAQsReorderStore } from '@/stores';

import { FAQCard } from './FAQCard';
import { FAQsCTA } from './FAQsCTA';

export const FAQsList = () => {
  useCTA(FAQsCTA);

  const faqsQuery = useFAQsQuery();

  const faqs = useFAQsReorderStore((state) => state.items) ?? faqsQuery.data ?? [];
  const isLoading = useFAQsReorderStore((state) => state.isLoading);
  const setQueryFAQs = useFAQsReorderStore((state) => state.setQueryItems);

  const { dndId, onDragEnd, sensors } = useReorder(useFAQsReorderStore);

  useEffect(() => {
    if (!faqsQuery.data) return;

    setQueryFAQs(faqsQuery.data);
  }, [faqsQuery.data, setQueryFAQs]);

  return (
    <section className="flex-1 flex flex-col gap-8 min-w-0">
      {faqs.length ? (
        <div className="flex flex-col gap-6">
          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              disabled={isLoading}
              items={faqs.map(({ id }) => id)}
              strategy={verticalListSortingStrategy}
            >
              {faqs.map((faq) => (
                <FAQCard key={faq.id} isDisabled={isLoading} {...faq} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no FAQs to display.
        </p>
      )}
    </section>
  );
};
