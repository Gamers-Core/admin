'use client';

import { TopBarCTA } from '@/components';
import { SearchSchema } from '@/api';
import { useProductsQuery } from '@/hooks';

import { ProductsCTA } from './ProductsCTA';
import { DataTable } from '../DataTable';
import { columns } from './columns';

interface ProductsListProps {
  searchParams: SearchSchema | undefined;
}

export const ProductsList = ({ searchParams }: ProductsListProps) => {
  const productsQuery = useProductsQuery(searchParams);

  return (
    <>
      <TopBarCTA>
        <ProductsCTA />
      </TopBarCTA>

      <DataTable data={productsQuery.data ?? []} columns={columns} placeholder="No products found." />
    </>
  );
};
