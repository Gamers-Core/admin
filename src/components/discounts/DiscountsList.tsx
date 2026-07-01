'use client';

import { SearchDiscountSchema } from '@/api';
import { useDiscountsQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { discountColumns } from './discountColumns';

interface DiscountsListProps {
  searchParams: SearchDiscountSchema | undefined;
}

export const DiscountsList = ({ searchParams }: DiscountsListProps) => {
  const discountsQuery = useDiscountsQuery(searchParams);

  return (
    <DataTable
      data={discountsQuery.data ?? []}
      columns={discountColumns}
      placeholder="No discounts found."
      getRowHref={({ id }) => `/discounts/${id}`}
    />
  );
};
