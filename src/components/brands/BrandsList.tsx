'use client';

import { useBrandsQuery, useCTA } from '@/hooks';

import { BrandCard } from './BrandCard';
import { BrandsCTA } from './BrandsCTA';

export const BrandsList = () => {
  useCTA(BrandsCTA);

  const brandsQuery = useBrandsQuery();

  return (
    <section className="flex-1 flex flex-col gap-8">
      {brandsQuery.data?.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {brandsQuery.data.map((brand) => (
            <BrandCard key={brand.id} {...brand} />
          ))}
        </div>
      ) : (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no brands to display.
        </p>
      )}
    </section>
  );
};
