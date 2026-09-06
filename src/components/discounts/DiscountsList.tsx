'use client';

import { SearchDiscountSchema } from '@/api';
import { useDiscountsInfiniteQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { discountColumns } from './discountColumns';

interface DiscountsListProps {
  searchParams: SearchDiscountSchema | undefined;
}

export const DiscountsList = ({ searchParams }: DiscountsListProps) => {
  const discountsQuery = useDiscountsInfiniteQuery(searchParams);

  const discounts = discountsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <DataTable
      data={discounts}
      columns={discountColumns}
      placeholder="No discounts found."
      getRowHref={({ id }) => `/discounts/${id}`}
      onLoadMore={discountsQuery.fetchNextPage}
      hasMore={discountsQuery.hasNextPage}
      isLoadingMore={discountsQuery.isFetchingNextPage}
    />
  );
};
