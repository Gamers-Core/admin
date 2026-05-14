'use client';

import { useCategoriesQuery, useCTA } from '@/hooks';

import { CategoryCard } from './CategoryCard';
import { CategoriesCTA } from './CategoriesCTA';

export const CategoriesList = () => {
  useCTA(CategoriesCTA);

  const categoriesQuery = useCategoriesQuery();

  return (
    <section className="flex-1 flex flex-col gap-8">
      {categoriesQuery.data?.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {categoriesQuery.data.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      ) : (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no categories to display.
        </p>
      )}
    </section>
  );
};
