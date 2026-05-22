'use client';

import { TopBarCTA, ReorderList } from '@/components';
import { useFeaturedVariantsQuery } from '@/hooks';

import { FeaturedVariantCard } from './FeaturedVariantCard';
import { FeaturedVariantsCTA } from './FeaturedVariantsCTA';

export const FeaturedVariantsList = () => {
  const featuredVariantsQuery = useFeaturedVariantsQuery();

  return (
    <ReorderList
      items={featuredVariantsQuery.data}
      renderEmpty={() => (
        <p className="m-auto text-center text-lg md:text-xl lg:text-2xl text-muted-foreground">
          There are no featured variants to display.
        </p>
      )}
      getKey={(v) => v.id}
      renderContainer={(children) => <div className="flex flex-col gap-6">{children}</div>}
      renderItem={(featuredVariant, sortable, _index, state) => (
        <FeaturedVariantCard
          key={featuredVariant.id}
          isMain={featuredVariant.position === 1}
          sortable={sortable}
          isDisabled={state.isLoading}
          {...featuredVariant}
        />
      )}
    >
      {(children, state) => (
        <>
          <TopBarCTA>
            <FeaturedVariantsCTA {...state} />
          </TopBarCTA>

          <section className="flex-1 flex flex-col gap-8 min-w-0">{children}</section>
        </>
      )}
    </ReorderList>
  );
};
