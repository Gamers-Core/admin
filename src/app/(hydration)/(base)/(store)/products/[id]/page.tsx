import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import {
  ProductForm,
  SelectProductRelations,
  ProductStatusSelectMenu,
  ProductUploadMedia,
  ProductVariantsTable,
  LocalizedForm,
} from '@/components';
import { ProductSchema } from '@/api';
import { useBrandsQuery, useCategoriesQuery, useProductQuery } from '@/hooks';
import { PagePropsWithParams } from '@/app/types';

export const metadata: Metadata = { title: 'Gamers Core | Products | Edit Product' };

export default async function EditProduct(props: PagePropsWithParams<{ id: string }>) {
  const { id } = await props.params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) return notFound();

  const queryClient = new QueryClient();

  const [product] = await Promise.allSettled([
    queryClient.fetchQuery({
      queryKey: useProductQuery.queryKey(productId),
      queryFn: useProductQuery.queryFn,
    }),
    queryClient.prefetchQuery(useBrandsQuery),
    queryClient.prefetchQuery(useCategoriesQuery),
  ]);

  if (product.status === 'rejected') return notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductForm className="flex-1 flex flex-col lg:flex-row gap-6" product={product.value}>
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
