import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import {
  AddProductForm,
  AddProductRelations,
  AddProductStatusSelectMenu,
  AddProductUploadMedia,
  AddProductVariants,
  LocalizedForm,
} from '@/components';
import { AddProductSchema } from '@/api';
import { useBrandsQuery, useCategoriesQuery } from '@/hooks';

export const metadata: Metadata = { title: 'Gamers Core | Products | Add Product' };

export default async function AddProduct() {
  const queryClient = new QueryClient();

  await Promise.allSettled([queryClient.prefetchQuery(useBrandsQuery), queryClient.prefetchQuery(useCategoriesQuery)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddProductForm className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="min-w-0 flex-4 flex flex-col gap-6">
          <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
            <LocalizedForm<AddProductSchema> name="name" className="md:flex-row" />

            <LocalizedForm<AddProductSchema> name="title" type="textarea" />

            <LocalizedForm<AddProductSchema> name="description" type="richtext" />
          </section>

          <AddProductUploadMedia />

          <AddProductVariants />
        </div>

        <section className="lg:sticky lg:top-0 lg:self-start grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-2 lg:grid-cols-1 min-w-0 flex-1 gap-4 bg-sidebar p-4 rounded-lg ">
          <AddProductStatusSelectMenu />

          <AddProductRelations />
        </section>
      </AddProductForm>
    </HydrationBoundary>
  );
}
