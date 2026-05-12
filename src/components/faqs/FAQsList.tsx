'use client';

import { useFAQsQuery } from '@/hooks';

import { FAQCard } from './FAQCard';

export const FAQsList = () => {
  const faqsQuery = useFAQsQuery();

  return (
    <section className="flex-1 flex flex-col gap-8 min-w-auto">
      {faqsQuery.data?.length ? (
        <div className="flex flex-col gap-6">
          {faqsQuery.data.map((faq) => (
            <FAQCard key={faq.id} {...faq} />
          ))}
        </div>
      ) : (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no faqs to display.
        </p>
      )}
    </section>
  );
};
