import { Metadata } from 'next';

import { AddProductForm, LocalizedForm } from '@/components';
import { AddProductSchema } from '@/api';

export const metadata: Metadata = { title: 'Gamers Core | Products | Add Product' };

export default async function AddProduct() {
  return (
    <AddProductForm className="flex-1 flex flex-col lg:flex-row gap-6">
      <div className="min-w-0 flex-3 flex flex-col gap-6">
        <section className="bg-sidebar p-4 rounded-lg flex flex-col gap-6">
          <LocalizedForm<AddProductSchema> name="name" className="md:flex-row" />

          <LocalizedForm<AddProductSchema> name="title" type="textarea" />

          <LocalizedForm<AddProductSchema> name="description" type="richtext" />
        </section>
      </div>

      <div className="min-w-0 flex-1">T2</div>
    </AddProductForm>
  );
}
