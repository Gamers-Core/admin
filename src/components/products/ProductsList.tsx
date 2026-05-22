'use client';

import { TopBarCTA } from '@/components';
import { SearchProductSchema } from '@/api';
import { useProductsQuery } from '@/hooks';

import { ProductsCTA } from './ProductsCTA';
import { DataTable } from '../DataTable';
import { productColumns } from './productColumns';

interface ProductsListProps {
  searchParams: SearchProductSchema | undefined;
}

export const ProductsList = ({ searchParams }: ProductsListProps) => {
  const productsQuery = useProductsQuery(searchParams);

  return (
    <>
      <TopBarCTA>
        <ProductsCTA />
      </TopBarCTA>

      <DataTable data={productsQuery.data ?? []} columns={productColumns} placeholder="No products found." />
    </>
  );
};
