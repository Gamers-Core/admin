'use client';

import { ReorderList } from '@/components';
import { useFAQsQuery } from '@/hooks';

import { FAQCard } from './FAQCard';
import { FAQsCTA } from './FAQsCTA';

export const FAQsList = () => {
  const faqsQuery = useFAQsQuery();

  return (
    <ReorderList
      items={faqsQuery.data}
      renderEmpty={() => (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no FAQs to display.
        </p>
      )}
      renderContainer={(children) => <div className="flex flex-col gap-6">{children}</div>}
      renderItem={(faq, sortable, _index, state) => (
        <FAQCard key={faq.id} sortable={sortable} isDisabled={state.isLoading} {...faq} />
      )}
    >
      {(children, state) => (
        <>
          <FAQsCTA {...state} />

          <section className="flex-1 flex flex-col gap-8 min-w-0">{children}</section>
        </>
      )}
    </ReorderList>
  );
};
