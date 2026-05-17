'use client';

import { useCTA, useProductsQuery } from '@/hooks';
import { SearchSchema } from '@/api';

import { ProductsCTA } from './ProductsCTA';
import { DataTable } from '../DataTable';
import { columns } from './columns';

interface ProductsListProps {
  searchParams: SearchSchema | undefined;
}

export const ProductsList = ({ searchParams }: ProductsListProps) => {
  useCTA(ProductsCTA);

  const productsQuery = useProductsQuery(searchParams);

  return <DataTable data={productsQuery.data ?? []} columns={columns} placeholder="No products found." />;
};
