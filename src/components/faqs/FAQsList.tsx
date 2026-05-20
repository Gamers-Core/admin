'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { useCTA, useFAQsQuery, useReorder } from '@/hooks';

import { FAQCard } from './FAQCard';
import { FAQsCTA } from './FAQsCTA';

export const FAQsList = () => {
  const faqsQuery = useFAQsQuery();

  const { dndId, onDragEnd, sensors, state } = useReorder({ items: faqsQuery.data ?? [] });

  useCTA(() => <FAQsCTA {...state} />);

  return (
    <section className="flex-1 flex flex-col gap-8 min-w-0">
      {state.items?.length ? (
        <div className="flex flex-col gap-6">
          <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              disabled={state.isLoading}
              items={state.items.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              {state.items.map((faq, index) => (
                <FAQCard key={faq.id} isDisabled={state.isLoading} index={index} {...faq} />
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
