'use client';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEffect, useId } from 'react';

import { useFAQsQuery } from '@/hooks';

import { FAQCard } from './FAQCard';
import { useFAQsReorderStore } from '@/stores';

export const FAQsList = () => {
  const faqsQuery = useFAQsQuery();

  const faqs = useFAQsReorderStore((state) => state.faqs) ?? faqsQuery.data ?? [];
  const isLoading = useFAQsReorderStore((state) => state.isLoading);
  const setFAQs = useFAQsReorderStore((state) => state.setFAQs);
  const setQueryFAQs = useFAQsReorderStore((state) => state.setQueryFAQs);

  const sensors = useSensors(useSensor(PointerSensor));
  const dndId = useId();

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !faqs) return;

    const oldIndex = faqs.findIndex((f) => f.id === active.id);
    const newIndex = faqs.findIndex((f) => f.id === over.id);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    setFAQs(arrayMove(faqs, oldIndex, newIndex));
  };

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
          There are no faqs to display.
        </p>
      )}
    </section>
  );
};
