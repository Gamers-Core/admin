'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';

import { Form, ProductFormCTA } from '@/components';
import { productSchema, ProductSchema, defaultLocalizedValue, Product } from '@/api';

interface ProductFormProps {
  children: React.ReactNode;
  className?: string;
  product?: Product;
}

const defaultValues: ProductSchema = {
  name: defaultLocalizedValue,
  title: defaultLocalizedValue,
  description: defaultLocalizedValue,
  status: 'draft',
  variants: [],
  media: [],
  brandId: null as unknown as number,
  categoryId: null as unknown as number,
};

export const ProductForm = (props: ProductFormProps) => {
  const values = useMemo(() => (props.product ? mapProductToSchema(props.product) : defaultValues), [props.product]);

  const form = useForm<ProductSchema>({
    defaultValues: values,
    mode: 'onChange',
    resolver: zodResolver(productSchema),
  });

  return (
    <Form {...form} {...props}>
      <ProductFormCTA isEditMode={!!props.product} productId={props.product?.id} />

      {props.children}
    </Form>
  );
};

const mapProductToSchema = ({ brand, category, variants, ...product }: Product): ProductSchema => ({
  ...product,
  brandId: brand?.id ?? (null as unknown as number),
  categoryId: category?.id ?? (null as unknown as number),
  variants: variants.map(({ image, compareAt, ...variant }) => ({
    ...variant,
    image,
    imageId: image.id,
    compareAt: compareAt ?? 0,
  })),
});
