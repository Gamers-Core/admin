import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  ProductForm,
  SelectProductRelations,
  ProductStatusSelectMenu,
  ProductUploadMedia,
  ProductVariantsTable,
  LocalizedForm,
} from '@/components';
import { ProductSchema } from '@/api';
import { useBrandsQuery, useCategoriesQuery } from '@/hooks';

export const metadata: Metadata = { title: 'Gamers Core | Products | Add Product' };

export default async function AddProduct() {
  const queryClient = new QueryClient();

  await Promise.allSettled([queryClient.prefetchQuery(useBrandsQuery), queryClient.prefetchQuery(useCategoriesQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductForm className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="min-w-0 flex-4 flex flex-col gap-6">
          <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
            <LocalizedForm<ProductSchema> name="name" className="md:flex-row" />

            <LocalizedForm<ProductSchema> name="title" type="textarea" />

            <LocalizedForm<ProductSchema> name="description" type="richtext" />
          </section>

          <ProductUploadMedia />

          <ProductVariantsTable />
        </div>

        <section className="lg:sticky lg:top-4 lg:self-start min-w-0 flex-1 bg-sidebar p-4 rounded-lg gap-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-2 lg:grid-cols-1">
          <ProductStatusSelectMenu />

          <SelectProductRelations />
        </section>
      </ProductForm>
    </HydrationBoundary>
  );
}
