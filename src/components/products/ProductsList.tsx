'use client';

import { SearchProductSchema } from '@/api';
import { useProductsQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { productColumns } from './productColumns';

interface ProductsListProps {
  searchParams: SearchProductSchema | undefined;
}

export const ProductsList = ({ searchParams }: ProductsListProps) => {
  const productsQuery = useProductsQuery(searchParams);

  return (
    <DataTable
      data={productsQuery.data ?? []}
      columns={productColumns}
      placeholder="No products found."
      getRowHref={({ id }) => `/products/${id}`}
    />
  );
};
