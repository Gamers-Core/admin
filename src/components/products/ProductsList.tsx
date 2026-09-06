'use client';

import { SearchProductSchema } from '@/api';
import { useProductsInfiniteQuery } from '@/hooks';

import { DataTable } from '../DataTable';
import { productColumns } from './productColumns';

interface ProductsListProps {
  searchParams: SearchProductSchema | undefined;
}

export const ProductsList = ({ searchParams }: ProductsListProps) => {
  const productsQuery = useProductsInfiniteQuery(searchParams);

  const products = productsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <DataTable
      data={products}
      columns={productColumns}
      placeholder="No products found."
      getRowHref={({ id }) => `/products/${id}`}
      onLoadMore={productsQuery.fetchNextPage}
      hasMore={productsQuery.hasNextPage}
      isLoadingMore={productsQuery.isFetchingNextPage}
    />
  );
};
