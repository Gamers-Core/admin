'use client';

import { useCTA, useProductsQuery } from '@/hooks';

import { ProductsCTA } from './ProductsCTA';
import { DataTable } from '../DataTable';
import { columns } from './columns';

export const ProductsList = () => {
  useCTA(ProductsCTA);

  const productsQuery = useProductsQuery();

  return <DataTable data={productsQuery.data ?? []} columns={columns} placeholder="No products found." />;
};
